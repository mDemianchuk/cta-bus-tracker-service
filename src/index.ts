import express from "express";
import {BusTrackerService} from "./service/bus-tracker-service";
import {BusRoute} from "./models/bus-route";
import {BusStop} from "./models/bus-stop";
import {BusDirection} from "./models/bus-direction";
import {BusPrediction} from "./models/bus-prediction";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './resources/swagger.json'
import * as bodyParser from 'body-parser'

const app = express();
const port = 8080;
const service = new BusTrackerService();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.redirect('/swagger');
});

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

app.get("/predictions", (req, res) => {
    let routeId: string = req.query.rt;
    let stopId: string = req.query.stp;
    service.getPredictions(routeId, stopId)
        .then((predictions: BusPrediction[]) => res.send(predictions));
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
