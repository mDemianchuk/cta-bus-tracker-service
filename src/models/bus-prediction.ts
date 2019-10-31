export class BusPrediction {
    readonly vehicleId: string;
    readonly stopId: string;
    readonly stopName: string;
    readonly routeId: string;
    readonly direction: string;
    readonly destination: string;
    readonly arrivalTime: string;
    readonly predictionTime: string;
    oppositeDirectionStopId: string | null;

    constructor(vehicleId: string, stopId: string, stopName: string, routeId: string, direction: string, destination: string, arrivalTime: string, predictionTime: string) {
        this.vehicleId = vehicleId;
        this.stopId = stopId;
        this.stopName = stopName;
        this.routeId = routeId;
        this.direction = direction;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
        this.predictionTime = predictionTime;
        this.oppositeDirectionStopId = null;
    }
}