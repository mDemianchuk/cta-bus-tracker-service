export class BusPrediction {
    readonly stopId: string;
    readonly stopName: string;
    readonly routeId: string;
    readonly routeName: string;
    readonly direction: string;
    readonly arrivalTime: string;
    readonly predictionTime: string;

    constructor(stopId: string, stopName: string, routeId: string, routeName: string, direction: string, arrivalTime: string, predictionTime: string) {
        this.stopId = stopId;
        this.stopName = stopName;
        this.routeId = routeId;
        this.routeName = routeName;
        this.direction = direction;
        this.arrivalTime = arrivalTime;
        this.predictionTime = predictionTime;
    }
}