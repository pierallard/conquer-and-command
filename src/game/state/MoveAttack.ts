import {State} from "./State";
import {Unit} from "../unit/Unit";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MoveAttack implements State {
    private worldKnowledge: WorldKnowledge;
    private unit: Unit;
    private goal: PIXI.Point;
    private standUpCounter: number;
    private lastPosition: PIXI.Point;

    constructor(worldKnowledge: WorldKnowledge, unit: Unit, goal: PIXI.Point) {
        this.worldKnowledge = worldKnowledge;
        this.unit = unit;
        this.goal = goal;
        this.standUpCounter = 0;
        this.lastPosition = this.unit.getCellPositions()[0];
    }

    getNextStep(): State {
        if (this.unit.getCellPositions()[0] === this.lastPosition) {
            this.standUpCounter += 1;
        } else {
            this.lastPosition = this.unit.getCellPositions()[0];
            this.standUpCounter = 0;
        }
        if (this.isArrived() || this.standUpCounter > 5) {
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
