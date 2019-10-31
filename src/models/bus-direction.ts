export class BusDirection {
    readonly direction: string;
    routeId: string | null;

    constructor(direction: string) {
        this.direction = direction;
        this.routeId = null;
    }
}