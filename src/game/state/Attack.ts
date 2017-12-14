import {State} from "./State";
import {AStarSprite} from "../sprite/AStarSprite";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";

export class Attack implements State {
    private unit: AStarSprite;
    private goal: AStarSprite;

    constructor(unit: AStarSprite, goal: AStarSprite) {
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
        if (this.goal.isDestroyed()) {
            return;
        }
        if (this.unit.isAbleToShoot(this.goal)) {
            this.unit.shootz(this.goal);
        } else {
            this.unit.moveTowards(this.goal.getCellPosition());
        }
    }

    isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal.getCellPosition(),
            this.unit.getCellPosition(),
            this.unit.isPositionAccessible.bind(this.unit)
        );
    }
}
