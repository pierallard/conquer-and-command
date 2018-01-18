import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {MinigunInfantry} from "../unit/MinigunInfantry";
import {BUILDING_POSITIONNER_MIN_DIST, BuildingPositioner} from "../interface/BuildingPositionner";

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

    private getRandomCellNearBase(buildingName: string): PIXI.Point {
        const constructionYard = this.worldKnowledge.getPlayerArmies(this, 'ConstructionYard')[0];
        if (!constructionYard) {
            return null;
        }
        const cellPos = constructionYard.getCellPositions()[0];

        let tries = 10;
        while (tries > 0) {
            const test = new PIXI.Point(
                cellPos.x + (
                    BUILDING_POSITIONNER_MIN_DIST / 2 + Math.floor(Math.random() * BUILDING_POSITIONNER_MIN_DIST)
                ),
                cellPos.y + (
                    BUILDING_POSITIONNER_MIN_DIST / 2 + Math.floor(Math.random() * BUILDING_POSITIONNER_MIN_DIST)
                )
            );
            if (BuildingPositioner.isAccessible(test, buildingName, this.worldKnowledge, this)) {
                return test;
            }

            tries--;
        }

        console.log('NO TFIND');
        return null;
    }

    private constructWhenYouCan(buildingName: string) {
        if (this.worldKnowledge.getPlayerArmies(this, buildingName).length === 0) {
            if (this.worldKnowledge.isBuildingProduced(this, buildingName)) {
                const randomCell = this.getRandomCellNearBase(buildingName);
                if (randomCell) {
                    this.order().createBuilding(buildingName, randomCell);
                }
            } else {
                this.order().productBuilding(buildingName);
            }
        }
    }
}
