import {State} from "./State";
import {AStarSprite} from "../sprite/AStarSprite";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";

export class MoveAttack implements State {
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
        const shootable = this.unit.getClosestShootable();
        if (shootable) {
            this.unit.shootz(shootable);
        } else {
            this.unit.moveTowards(this.goal);
        }
    }

    private isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPosition(),
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }
}
