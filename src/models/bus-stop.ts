export class BusStop {
    readonly id: string;
    readonly name: string;
    readonly routeId: string;
    readonly direction: string;
    oppositeStopId: string;

    constructor(id: string, name: string, route_id: string, direction: string) {
        this.id = id;
        this.name = name;
        this.routeId = route_id;
        this.direction = direction;
    }
}