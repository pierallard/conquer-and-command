import {Player} from "./Player";
import {MCV} from "../unit/MCV";

export class ComputerPlayer extends Player {
    update() {
        // Check if MCV to open
        this.worldKnowledge.getPlayerUnits(this).filter((unit) => {
            return unit.constructor.name === 'MCV';
        }).forEach((unit) => {
            (<MCV> unit).orderExpand();
        });
    }
}
