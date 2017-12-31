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

    getBuildings(type: string = null): Building[] {
        if (type === null) {
            return this.buildings;
        }
        return this.buildings.filter((building) => {
            return building.constructor.name === type;
        });
    }

    getCreatorOf(unit: string): Building[] {
        return this.buildings.filter((building) => {
            return (BuildingProperties.getConstructableUnits(building.constructor.name).indexOf(unit) > -1);
        });
    }

    removeBuilding(building: Building) {
        building.destroy();
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.buildings.splice(index, 1);
        }
    }
}
