import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";
import {Unit} from "../unit/Unit";

export class MoveTo implements State {
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
        if (!this.isArrived()) {
            this.unit.moveTowards(this.goal);
        }
    }

    private isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPositions()[0],
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }
}
