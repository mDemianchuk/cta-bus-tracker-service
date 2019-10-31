import {BusTrackerClient} from "../client/bus-tracker-client";
import {BusRoute} from "../models/bus-route";
import {BusStop} from "../models/bus-stop";
import {BusDirection} from "../models/bus-direction";

export class BusTrackerService {
    private readonly client: BusTrackerClient;
    private readonly directionMap: Map<string, BusDirection[]>;

    constructor() {
        this.client = new BusTrackerClient();
        this.directionMap = new Map<string, BusDirection[]>();
    }

    async getRoutes(): Promise<BusRoute[]> {
        return this.client.getRoutes();
    }

    async getDirections(routeId: string): Promise<BusDirection[]> {
        let directions: BusDirection[] | undefined = this.directionMap.get(routeId);
        if (!directions || directions.length === 0) {
            directions = await this.client.getDirections(routeId);
            directions.forEach((direction: BusDirection) => {
                direction.routeId = routeId;
            });
            this.directionMap.set(routeId, directions);
        }
        return directions;
    }

    async getStops(routeId: string, direction: string): Promise<BusStop[]> {
        let oppositeDirectionStopMap: Map<string, string> = new Map<string, string>();
        let availableDirections: BusDirection[] = await this.getDirections(routeId);
        let oppositeDirection: BusDirection | undefined = availableDirections
            .filter((dir: BusDirection) => dir.direction !== direction)
            .shift();

        if (oppositeDirection) {
            await this.client.getStops(routeId, oppositeDirection.direction)
                .then((stops: BusStop[]) => {
                    stops.forEach((stop: BusStop) => {
                        oppositeDirectionStopMap.set(stop.name, stop.id);
                    });
                });
        }

        return this.client.getStops(routeId, direction)
            .then((stops: BusStop[]) => {
                stops.forEach((stop: BusStop) => {
                    stop.routeId = routeId;
                    stop.direction = direction;
                    let oppositeDirectionId = oppositeDirectionStopMap.get(stop.name);
                    if (oppositeDirectionId) {
                        stop.oppositeDirectionStopId = oppositeDirectionId;
                    }
                });
                return stops;
            });
    }
}