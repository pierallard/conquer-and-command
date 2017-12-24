import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {WorldKnowledge} from "../WorldKnowledge";

export class MoveAttack implements State {
    private worldKnowledge: WorldKnowledge;
    private unit: Unit;
    private goal: PIXI.Point;

    constructor(worldKnowledge: WorldKnowledge, unit: Unit, goal: PIXI.Point) {
        this.worldKnowledge = worldKnowledge;
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

    private isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPositions()[0],
            this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
        );
    }
}
