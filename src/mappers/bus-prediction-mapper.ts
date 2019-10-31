import {BusPrediction} from "../models/bus-prediction";
import {CtaMapper} from "./cta-mapper";

export class BusPredictionMapper implements CtaMapper<BusPrediction> {

    map(json: { [key: string]: any }): BusPrediction | undefined {
        let prediction;
        if (this.isValid(json)) {
            prediction = new BusPrediction(
                json['vid'],
                json['stpid'],
                json['stpnm'],
                json['rt'],
                json['rtdir'],
                json['des'],
                json['prdtm'],
                json['tmstmp']
            );
        }
        return prediction;
    }

    isValid(json: { [key: string]: any }): boolean {
        return json.hasOwnProperty('vid')
            && json.hasOwnProperty('stpid')
            && json.hasOwnProperty('stpnm')
            && json.hasOwnProperty('rt')
            && json.hasOwnProperty('rtdir')
            && json.hasOwnProperty('des')
            && json.hasOwnProperty('prdtm')
            && json.hasOwnProperty('tmstmp');
    }
}