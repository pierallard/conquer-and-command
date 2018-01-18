import {Army} from "../Army";
import {Building} from "../building/Building";
import {BuildingProperties} from "../building/BuildingProperties";

export class ArmyRepository {
    private static itemAt(position: PIXI.Point, items: Army[]): Army {
        for (let i = 0; i < items.length; i++) {
            const cellPositions = items[i].getCellPositions();
            for (let j = 0; j < cellPositions.length; j++) {
                if (
                    cellPositions[j].x === position.x &&
                    cellPositions[j].y === position.y
                ) {
                    return (<Army> items[i]);
                }
            }
        }

        return null;
    }

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

    isGroundCellAccessible(position: PIXI.Point): boolean {
        return (null === this.groundItemAt(position));
    }

    isAerialCellAccessible(position: PIXI.Point): boolean {
        return (null === this.aerialItemAt(position));
    }

    groundItemAt(position: PIXI.Point): Army {
        return ArmyRepository.itemAt(position, this.items.filter((item) => {
            return item.isOnGround();
        }));
    }

    aerialItemAt(position: PIXI.Point): Army {
        return ArmyRepository.itemAt(position, this.items.filter((item) => {
            return !item.isOnGround();
        }));
    }

    getSelectedArmies(): Army[] {
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
