import {State} from "./State";
import {Unit} from "../unit/Unit";
import {AlternativePosition} from "../AlternativePosition";

export class Follow implements State {
    private unit: Unit;
    private goal: Unit;

    constructor(unit: Unit, goal: Unit) {
        this.unit = unit;
        this.goal = goal;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        if (!this.isArrived()) {
            this.unit.moveTowards(this.goal.getCellPositions()[0])
        }
    }

    private isArrived(): boolean
    {
        return AlternativePosition.isArrived(
            this.goal.getCellPositions()[0],
            this.unit.getCellPositions()[0],
            this.unit.getPlayer().isPositionAccessible.bind(this.unit.getPlayer())
        );
    }

}
