import {Unit} from "./Unit";
import {Stand} from "../state/Stand";
import {ConstructionYard} from "../building/ConstructionYard";

export class MCV extends Unit {
    private expanded: boolean = false;

    orderExpand() {
        this.state = new Stand(this);
        this.expand();
    }

    updateStateAfterClick(cell: PIXI.Point) {
        if (!this.expanded) {
            const unit = this.worldKnowledge.getGroundArmyAt(cell);
            if (null !== unit && unit === this) {
                this.orderExpand();

                return;
            }
        }

        super.updateStateAfterClick(cell);
    }

    private expand() {
        this.expanded = true;
        this.worldKnowledge.addArmy(
            new ConstructionYard(
                this.worldKnowledge,
                new PIXI.Point(this.cellPosition.x - 1, this.cellPosition.y),
                this.player
            )
        );
        this.worldKnowledge.removeArmy(this, 1000);
    }
}
