import {State} from "./State";
import {Unit} from "../unit/Unit";
import {AlternativePosition} from "../computing/AlternativePosition";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Army} from "../Army";

export class Follow implements State {
    private worldKnowledge: WorldKnowledge;
    private unit: Unit;
    private goal: Army;

    constructor(worldKnowledge: WorldKnowledge, unit: Unit, goal: Army) {
        this.worldKnowledge = worldKnowledge;
        this.unit = unit;
        this.goal = goal;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        if (!this.isArrived()) {
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

}
