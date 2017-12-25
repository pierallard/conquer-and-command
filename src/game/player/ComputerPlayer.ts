import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {PowerPlant} from "../building/PowerPlant";

export class ComputerPlayer extends Player {
    update() {
        // Check if MCV to open
        this.worldKnowledge.getPlayerUnits(this).filter((unit) => {
            return unit.constructor.name === 'MCV';
        }).forEach((unit) => {
            (<MCV> unit).orderExpand();
        });

        // Check if there is Power Plant
        if (this.worldKnowledge.getPlayerBuildings(this).filter((building) => {
            return building.constructor.name === 'PowerPlant';
        }).length === 0) {
            /**
             * Le AbstractCreator est beaucoup trop UI-based.
             * Il faudrait le découper pour avoir une partie UI et une partie back.
             */
            const cellPos = this.worldKnowledge.getPlayerBuildings(this, 'ConstructionYard')[0].getCellPositions()[0];
            const randomCellPost = new PIXI.Point(
                cellPos.x + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1),
                cellPos.y + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1)
            );
            let powerPlant = new PowerPlant(this.worldKnowledge, randomCellPost, this);
            this.worldKnowledge.addBuilding(powerPlant, true);
        }
    }
}
