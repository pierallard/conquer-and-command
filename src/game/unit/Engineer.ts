import {Unit} from "./Unit";
import {ConstructableBuilding} from "../building/ConstructableBuilding";
import {Capture} from "../state/Capture";

export class Engineer extends Unit {
    updateStateAfterClick(cell: PIXI.Point) {
        const army = this.worldKnowledge.getArmyAt(cell);
        if (null !== army && army instanceof ConstructableBuilding && army.getPlayer() !== this.player) {
            this.state = new Capture(this.worldKnowledge, this, <ConstructableBuilding> army);

            return;
        }

        super.updateStateAfterClick(cell);
    }
}
