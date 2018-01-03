import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {MoveTo} from "../state/MoveTo";
import {Follow} from "../state/Follow";
import {Stand} from "../state/Stand";
import {ConstructionYard} from "../building/ConstructionYard";

export class MCV extends Unit {
    private expanded: boolean = false;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }

    orderExpand() {
        this.state = new Stand(this);
        this.expand();
    }

    updateStateAfterClick(cell: PIXI.Point) {
        if (!this.expanded) {
            const unit = this.worldKnowledge.getUnitAt(cell);
            if (null !== unit) {
                if (unit === this) {
                    this.orderExpand();
                }
                if (this.getPlayer() !== unit.getPlayer()) {
                    this.state = new MoveTo(this.worldKnowledge, this, unit.getCellPositions()[0]);
                } else {
                    this.state = new Follow(this.worldKnowledge, this, unit);
                }
            } else {
                this.state = new MoveTo(this.worldKnowledge, this, cell);
            }
        }
    }

    private expand() {
        this.expanded = true;
        this.worldKnowledge.addBuilding(
            new ConstructionYard(
                this.worldKnowledge,
                new PIXI.Point(this.cellPosition.x - 1, this.cellPosition.y),
                this.player
            ),
            true
        );
        this.worldKnowledge.removeUnit(this, 1000);
    }
}
