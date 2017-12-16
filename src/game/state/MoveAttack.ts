import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";

export class MoveAttack implements State {
    private unit: Unit;
    private goal: PIXI.Point;

    constructor(unit: Unit, goal: PIXI.Point) {
        this.unit = unit;
        this.goal = goal;
    }

    getNextStep(): State {
        if (this.isArrived()) {
            return new Stand(this.unit);
        }

        return this;
    }

    run(): void {
        const shootable = this.unit.getClosestShootable();
        if (shootable) {
            this.unit.shoot(shootable);
        } else {
            this.unit.moveTowards(this.goal);
        }
    }

    private isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPositions()[0],
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }
}
