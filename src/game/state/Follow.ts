import {State} from "./State";
import {AStarSprite} from "../sprite/AStarSprite";
import {AlternativePosition} from "../AlternativePosition";

export class Follow implements State {
    private unit: AStarSprite;
    private goal: AStarSprite;

    constructor(unit: AStarSprite, goal: AStarSprite) {
        this.unit = unit;
        this.goal = goal;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        if (!this.isArrived()) {
            this.unit.moveTowards(this.goal.getCellPosition())
        }
    }

    private isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal.getCellPosition(),
            this.unit.getCellPosition(),
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }

}
