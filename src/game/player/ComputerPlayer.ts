import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {MinigunInfantry} from "../unit/MinigunInfantry";

export class ComputerPlayer extends Player {
    update() {
        // Check if MCV to open
        this.worldKnowledge.getPlayerArmies(this, 'MCV').forEach((unit) => {
            this.order().expand((<MCV> unit));
        });

        this.constructWhenYouCan('PowerPlant');
        this.constructWhenYouCan('TiberiumRefinery');
        this.constructWhenYouCan('Barracks');

        if (this.worldKnowledge.getPlayerArmies(this, 'Barracks').length > 0) {
            this.order().productUnit('MinigunInfantry');
        }

        // Attack
        if (this.worldKnowledge.getPlayerArmies(this, 'MinigunInfantry').length > 5) {
            this.worldKnowledge.getPlayerArmies(this, 'MinigunInfantry').forEach((unit) => {
                this.order().orderMoveAttack(<MinigunInfantry> unit, new PIXI.Point(0, 0));
            });
        }
    }

    private getRandomCellNearBase(): PIXI.Point {
        const constructionYard = this.worldKnowledge.getPlayerArmies(this, 'ConstructionYard')[0];
        if (!constructionYard) {
            return null;
        }
        const cellPos = constructionYard.getCellPositions()[0];
        return new PIXI.Point(
            cellPos.x + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1),
            cellPos.y + (2 + Math.floor(Math.random() * 3)) * (Math.random() > 0.5 ? -1 : 1)
        );
    }

    private constructWhenYouCan(buildingName: string) {
        if (this.worldKnowledge.getPlayerArmies(this, buildingName).length === 0) {
            if (this.worldKnowledge.isBuildingProduced(this, buildingName)) {
                if (this.getRandomCellNearBase()) {
                    this.order().createBuilding(buildingName, this.getRandomCellNearBase());
                }
            } else {
                this.order().productBuilding(buildingName);
            }
        }
    }
}
