import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";
import {AStarSprite} from "../sprite/AStarSprite";

export class MoveTo implements State {
    private unit: AStarSprite;
    private goal: PIXI.Point;

    constructor(unit: AStarSprite, goal: PIXI.Point) {
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

    private isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPosition(),
            this.unit.isPositionAccessible.bind(this.unit)
        );
    }
}
