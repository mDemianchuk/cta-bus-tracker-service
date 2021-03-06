import {BusTrackerClient} from "../client/bus-tracker-client";
import {BusRoute} from "../models/bus-route";
import {BusStop} from "../models/bus-stop";
import {BusDirection} from "../models/bus-direction";
import {BusPrediction} from "../models/bus-prediction";

export class BusTrackerService {
    private readonly client: BusTrackerClient;
    private routeListCache: BusRoute[];
    // <route id, directions>
    private readonly directionMapCache: Map<string, BusDirection[]>;
    // <route id, Map <direction, bus stops>>
    private readonly stopMapCache: Map<string, Map<string, BusStop[]>>;
    // <stop id, opposite direction stop id>
    private readonly oppositeDirectionStopIdMapCache: Map<string, string>;

    constructor() {
        this.client = new BusTrackerClient();
        this.routeListCache = [];
        this.directionMapCache = new Map<string, BusDirection[]>();
        this.stopMapCache = new Map<string, Map<string, BusStop[]>>();
        this.oppositeDirectionStopIdMapCache = new Map<string, string>();
    }

    async getRoutes(): Promise<BusRoute[]> {
        let cachedRoutes = this.routeListCache;
        if (cachedRoutes.length > 0) {
            return cachedRoutes;
        }

        return this.client.getRoutes()
            .then((routes: BusRoute[]) => {
                this.routeListCache = routes;
                return routes;
            })
    }

    async getDirections(routeId: string): Promise<BusDirection[]> {
        let cachedDirections: BusDirection[] | undefined = this.getCachedData(routeId, this.directionMapCache);
        if (cachedDirections && cachedDirections.length > 0) {
            return cachedDirections;
        }

        return this.client.getDirections(routeId)
            .then((directions: BusDirection[]) => {
                directions.forEach((direction: BusDirection) => {
                    direction.routeId = routeId;
                });
                this.cacheData(routeId, directions, this.directionMapCache);
                return directions;
            });
    }

    async getStops(routeId: string, direction: string): Promise<BusStop[]> {
        let cachedStopMap: Map<string, BusStop[]> = this.getCachedStopMap(routeId);
        let cachedStops: BusStop[] | undefined = this.getCachedData(direction, cachedStopMap);
        if (cachedStops && cachedStops.length > 0) {
            return cachedStops;
        }

        let oppositeDirectionStopIdMap: Map<string, string> = new Map<string, string>();
        let availableDirections: BusDirection[] = await this.getDirections(routeId);
        let oppositeDirection: BusDirection | undefined = availableDirections
            .filter((dir: BusDirection) => dir.direction !== direction)
            .shift();
        if (oppositeDirection) {
            await this.client.getStops(routeId, oppositeDirection.direction)
                .then((stops: BusStop[]) => {
                    stops.forEach((stop: BusStop) => {
                        oppositeDirectionStopIdMap.set(stop.name, stop.id);
                    });
                });
        }

        return this.client.getStops(routeId, direction)
            .then((stops: BusStop[]) => {
                stops.forEach((stop: BusStop) => {
                    stop.routeId = routeId;
                    stop.direction = direction;
                    let oppositeDirectionStopId = oppositeDirectionStopIdMap.get(stop.name);
                    if (oppositeDirectionStopId) {
                        stop.oppositeDirectionStopId = oppositeDirectionStopId;
                        this.cacheData(stop.id, oppositeDirectionStopId, this.oppositeDirectionStopIdMapCache);
                        this.cacheData(oppositeDirectionStopId, stop.id, this.oppositeDirectionStopIdMapCache);
                    }
                });
                this.cacheData(direction, stops, cachedStopMap);
                this.cacheData(routeId, cachedStopMap, this.stopMapCache);
                return stops;
            });
    }

    async getPredictions(routeId: string, stopId: string): Promise<BusPrediction[]> {
        return this.client.getPredictions(routeId, stopId)
            .then((predictions: BusPrediction[]) => {
                predictions.forEach((prediction: BusPrediction) => {
                    let oppositeDirectionStopId: string | undefined = this.getCachedData(prediction.stopId, this.oppositeDirectionStopIdMapCache);
                    if (oppositeDirectionStopId) {
                        prediction.oppositeDirectionStopId = oppositeDirectionStopId;
                    }
                });
                return predictions;
            });
    }

    private getCachedStopMap(routeId: string): Map<string, BusStop[]> {
        let cachedStopMap: Map<string, BusStop[]> | undefined = this.getCachedData(routeId, this.stopMapCache);
        return cachedStopMap ? cachedStopMap : new Map<string, BusStop[]>();
    }

    private getCachedData<T>(key: string, cacheMap: Map<string, T>): T | undefined {
        return cacheMap.get(key);
    }

    private cacheData<T>(key: string, value: T, cacheMap: Map<string, T>): void {
        cacheMap.set(key, value);
    }
}