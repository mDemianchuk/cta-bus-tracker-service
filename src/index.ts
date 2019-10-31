import express from "express";
import {config} from "dotenv";
import {BusTrackerClient} from "./client/bus-tracker-client";

const index = express();
const port = 8080;

config();
let apiKey = process.env['API_KEY'] || '';

let client = new BusTrackerClient(apiKey);

index.get("/routes", (req, res) => {
    client.getRoutes()
        .then(routes => res.send(routes));
});

index.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
