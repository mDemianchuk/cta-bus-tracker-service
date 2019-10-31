import {BusRoute} from "../models/bus-route";
import {FetchHelper} from "../utils/fetch-helper";
import {ResponseProcessor} from "../utils/response-processor";
import {BusRouteMapper} from "../mappers/bus-route-mapper";

export class BusTrackerClient {
    private readonly apiKey: string;
    private readonly baseUrl: URL;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = new URL('http://www.ctabustracker.com/bustime/api/v2/');
    }

    async getRoutes(): Promise<BusRoute[]> {
        const url = new URL('getroutes', this.baseUrl);
        url.searchParams.set('key', this.apiKey);
        url.searchParams.set('format', 'json');
        return FetchHelper.fetch(url)
            .then((json: { [key: string]: any }) => {
                return ResponseProcessor.process(json, new BusRouteMapper(), 'bustime-response', 'routes')
            });
    }
}