import express from "express";
import {BusTrackerService} from "./service/bus-tracker-service";
import {BusRoute} from "./models/bus-route";
import {BusStop} from "./models/bus-stop";
import {BusDirection} from "./models/bus-direction";

const app = express();
const port = 8080;

let service = new BusTrackerService();

app.get("/routes", (req, res) => {
    service.getRoutes()
        .then((routes: BusRoute[]) => res.send(routes));
});

app.get("/directions", (req, res) => {
    let routeId: string = req.query.rt;
    service.getDirections(routeId)
        .then((directions: BusDirection[]) => res.send(directions));
});

app.get("/stops", (req, res) => {
    let routeId: string = req.query.rt;
    let direction: string = req.query.dir;
    service.getStops(routeId, direction)
        .then((directions: BusStop[]) => res.send(directions));
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
