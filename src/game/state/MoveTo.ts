import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Unit} from "../unit/Unit";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MoveTo implements State {
    protected unit: Unit;
    protected goal: PIXI.Point;
    private worldKnowledge: WorldKnowledge;
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
        if (!this.isArrived()) {
            this.unit.moveTowards(this.goal);
        }
    }

    private isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.goal,
            this.unit.getCellPositions()[0],
            this.unit.isOnGround() ?
                this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge) :
                this.worldKnowledge.isAerialCellAccessible.bind(this.worldKnowledge)
        );
    }
}
