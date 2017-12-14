import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";

export class Attack implements State {
    private unit: Unit;
    private goal: Unit;

    constructor(unit: Unit, goal: Unit) {
        this.unit = unit;
        this.goal = goal;
    }

    getNextStep(): State {
        if (this.isArrived() || !this.goal.isAlive()) {
            return new Stand(this.unit);
        }

        return this;
    }

    run(): void {
        if (!this.goal.isAlive()) {
            return;
        }
        if (this.isAbleToShoot()) {
            this.unit.shoot(this.goal);
        } else {
            this.unit.moveTowards(this.goal.getCellPosition());
        }
    }

    isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal.getCellPosition(),
            this.unit.getCellPosition(),
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }

    private isAbleToShoot(): boolean {
        return this.distanceTo() <= this.unit.getShootDistance();
    }

    private distanceTo(): number {
        return Math.sqrt(
            (this.unit.getCellPosition().x - this.goal.getCellPosition().x) * (this.unit.getCellPosition().x - this.goal.getCellPosition().x) +
            (this.unit.getCellPosition().y - this.goal.getCellPosition().y) * (this.unit.getCellPosition().y - this.goal.getCellPosition().y)
        );
    }
}
