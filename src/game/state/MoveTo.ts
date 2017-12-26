import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Unit} from "../unit/Unit";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MoveTo implements State {
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
        if (!this.isArrived()) {
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
