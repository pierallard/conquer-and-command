import {Unit} from "../unit/Unit";
import {Player} from "../player/Player";

export class UnitRepository {
    private units: Unit[];

    constructor() {
        this.units = [];
    }

    add(unit: Unit): void {
        this.units.push(unit);
    }

    getUnits(): Unit[] {
        return this.units;
    }

    removeUnit(movedSprite: Unit) {
        const index = this.units.indexOf(movedSprite);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return (null === this.unitAt(position));
    }

    unitAt(position: PIXI.Point): Unit {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i] instanceof Unit) {
                const cellPositions = this.units[i].getCellPositions();
                for (let j = 0; j < cellPositions.length; j++) {
                    if (
                        cellPositions[j].x === position.x &&
                        cellPositions[j].y === position.y
                    ) {
                        return (<Unit> this.units[i]);
                    }
                }
            }
        }

        return null;
    }

    getEnemyUnits(player: Player): Unit[] {
        return this.units.filter((unit) => {
            return unit.getPlayer() !== player;
        });
    }

    getSelectedUnits() {
        return this.units.filter((unit) => {
            return unit.isSelected();
        });
    }
}
