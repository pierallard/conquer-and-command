import {State} from "./State";
import {Engineer} from "../unit/Engineer";
import {ConstructableBuilding} from "../building/ConstructableBuilding";
import {AlternativePosition} from "../computing/AlternativePosition";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class Capture implements State {
    private worldKnowledge: WorldKnowledge;
    private engineer: Engineer;
    private building: ConstructableBuilding;

    constructor(worldKnowledge: WorldKnowledge, engineer: Engineer, building: ConstructableBuilding) {
        this.worldKnowledge = worldKnowledge;
        this.engineer = engineer;
        this.building = building;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        if (this.isArrived()) {
            this.building.capture(this.engineer);
        } else {
            this.engineer.moveTowards(this.building.getCellPositions()[0]);
        }
    }

    private isArrived(): boolean {
        return AlternativePosition.isArrived(
            this.building.getCellPositions()[0],
            this.engineer.getCellPositions()[0],
            this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge)
        );
    }
}
