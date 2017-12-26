import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {PowerPlant} from "../building/PowerPlant";
import {Barracks} from "../building/Barracks";
import {Tank} from "../unit/Tank";

export class ComputerPlayer extends Player {
    update() {
        // Check if MCV to open
        this.worldKnowledge.getPlayerUnits(this, 'MCV').forEach((unit) => {
            this.order().expand((<MCV> unit));
        });

        // Check if there is Power Plant
        if (this.worldKnowledge.getPlayerBuildings(this, 'PowerPlant').length === 0) {
            if (this.order().getBuildingCreator().isProduced('PowerPlant')) {
                this.order().createBuilding('PowerPlant', this.getRandomCellNearBase());
            } else {
                this.order().productBuilding('PowerPlant');
            }
        }

        // Check if there is Barracks
        if (this.worldKnowledge.getPlayerBuildings(this, 'Barracks').length === 0) {
            if (this.order().getBuildingCreator().isProduced('Barracks')) {
                this.order().createBuilding('Barracks', this.getRandomCellNearBase());
            } else {
                this.order().productBuilding('Barracks');
            }
        } else {
            this.order().productUnit('Tank');
        }

        // Attack
        this.worldKnowledge.getPlayerUnits(this, 'Tank').forEach((unit) => {
            this.order().orderMoveAttack(unit, new PIXI.Point(0, 0));
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
