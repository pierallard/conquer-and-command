import {Building} from "../building/Building";
import {BuildingProperties} from "../building/BuildingProperties";

export class BuildingRepository {
    private buildings: Building[];

    constructor() {
        this.buildings = [];
    }

    add(building: Building) {
        this.buildings.push(building);
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return this.buildingAt(position) === null;
    }

    buildingAt(position: PIXI.Point): Building {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            const cellPositions = building.getCellPositions();
            for (let j = 0; j < cellPositions.length; j++) {
                if (cellPositions[j].x === position.x &&
                    cellPositions[j].y === position.y) {
                    return building;
                }
            }
        }

        return null;
    }

    getBuildings() {
        return this.buildings;
    }

    getCreatorOf(unit: string): Building {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            if (BuildingProperties.getConstructableUnits(building.constructor.name).indexOf(unit) > -1) {
                return building;
            }
        }

        return null;
    }
}
