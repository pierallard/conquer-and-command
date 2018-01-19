import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Distance} from "../computing/Distance";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Shootable} from "../Shootable";
import {UnitProperties} from "../unit/UnitProperties";

export class Attack implements State {
    private goal: Shootable;
    protected unit: Unit;
    protected worldKnowledge: WorldKnowledge;

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

    private isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.goal.getCellPositions()[0],
            this.unit.getCellPositions()[0],
            this.unit.isOnGround() ?
                this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge) :
                this.worldKnowledge.isAerialCellAccessible.bind(this.worldKnowledge)
        );
    }

    private isAbleToShoot(): boolean {
        return this.unit.canShoot &&
            (this.goal.isOnGround() || UnitProperties.getShootAirPower(this.unit.constructor.name) > 0) &&
            Distance.to(this.unit.getCellPositions(), this.goal.getCellPositions()) < this.unit.getShootDistance();
    }
}
