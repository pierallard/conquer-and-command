import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Distance} from "../computing/Distance";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Shootable} from "../Shootable";

export class Attack implements State {
    private worldKnowledge: WorldKnowledge;
    private unit: Unit;
    private goal: Shootable;

    constructor(worldKnowledge: WorldKnowledge, unit: Unit, goal: Shootable) {
        this.worldKnowledge = worldKnowledge;
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
            this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge)
        );
    }

    private isAbleToShoot(): boolean {
        return Distance.to(this.unit.getCellPositions(), this.goal.getCellPositions()) < this.unit.getShootDistance();
    }
}
