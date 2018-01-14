import {Army} from "../Army";
import {Building} from "../building/Building";
import {BuildingProperties} from "../building/BuildingProperties";

export class ArmyRepository {
    private items: Army[];

    constructor() {
        this.items = [];
    }

    add(army: Army): void {
        this.items.push(army);
    }

    getItems(type: string = null): Army[] {
        if (null === type) {
            return this.items;
        }
        return this.items.filter((unit) => {
            return unit.constructor.name === type;
        });
    }

    removeArmy(army: Army) {
        army.destroy();
        const index = this.items.indexOf(army);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return (null === this.itemAt(position));
    }

    itemAt(position: PIXI.Point): Army {
        for (let i = 0; i < this.items.length; i++) {
            const cellPositions = this.items[i].getCellPositions();
            for (let j = 0; j < cellPositions.length; j++) {
                if (
                    cellPositions[j].x === position.x &&
                    cellPositions[j].y === position.y
                ) {
                    return (<Army> this.items[i]);
                }
            }
        }

        return null;
    }

    getSelectedUnits(): Army[] {
        return this.items.filter((unit) => {
            return unit.isSelected();
        });
    }

    getCreatorOf(unit: string): Building[] {
        return this.items.filter((item) => {
            return (BuildingProperties.getConstructableUnits(item.constructor.name).indexOf(unit) > -1);
        });
    }
}
