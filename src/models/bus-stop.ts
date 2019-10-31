export class BusStop {
    readonly id: string;
    readonly name: string;
    routeId: string | null;
    direction: string | null;
    oppositeDirectionStopId: string | null;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.routeId = null;
        this.direction = null;
        this.oppositeDirectionStopId = null;
    }
}