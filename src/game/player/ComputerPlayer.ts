import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {PowerPlant} from "../building/PowerPlant";
import {Barracks} from "../building/Barracks";
import {Tank} from "../unit/Tank";

export class ComputerPlayer extends Player {
    update() {
        // Check if MCV to open
        this.worldKnowledge.getPlayerUnits(this, 'MCV').forEach((unit) => {
            (<MCV> unit).orderExpand();
        });

        /**
         * Le AbstractCreator est beaucoup trop UI-based.
         * Il faudrait le découper pour avoir une partie UI et une partie back.
         */

        // Check if there is Power Plant
        if (this.worldKnowledge.getPlayerBuildings(this).filter((building) => {
                return building.constructor.name === 'PowerPlant';
            }).length === 0) {
            let powerPlant = new PowerPlant(this.worldKnowledge, this.getRandomCellNearBase(), this);
            this.worldKnowledge.addBuilding(powerPlant, true);
        }

        // Check if there is Barracks
        if (this.worldKnowledge.getPlayerBuildings(this).filter((building) => {
                return building.constructor.name === 'Barracks';
            }).length === 0) {
            let barracks = new Barracks(this.worldKnowledge, this.getRandomCellNearBase(), this);
            this.worldKnowledge.addBuilding(barracks, true);
        } else {
            // Construct units
            let tank = new Tank(this.worldKnowledge, this.getRandomCellNearBase(), this);
            this.worldKnowledge.addUnit(tank);
        }

        this.worldKnowledge.getPlayerUnits(this, 'Tank').forEach((unit) => {
            (<Tank> unit).orderMoveAttack(new PIXI.Point(0, 0));
        });
    }

    private getRandomCellNearBase(): PIXI.Point {
        const cellPos = this.worldKnowledge.getPlayerBuildings(this, 'ConstructionYard')[0].getCellPositions()[0];
        return new PIXI.Point(
            cellPos.x + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1),
            cellPos.y + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1)
        );
    }

}
