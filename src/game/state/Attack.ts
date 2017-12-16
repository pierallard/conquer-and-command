import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";
import {Distance} from "../Distance";

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
            this.unit.moveTowards(this.goal.getCellPositions()[0]);
        }
    }

    isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.goal.getCellPositions()[0],
            this.unit.getCellPositions()[0],
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }

    private isAbleToShoot(): boolean {
        return Distance.to(this.unit.getCellPositions(), this.goal.getCellPositions()) < this.unit.getShootDistance();
    }
}
