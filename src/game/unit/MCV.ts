import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../WorldKnowledge";
import {MoveTo} from "../state/MoveTo";
import {Follow} from "../state/Follow";
import {Stand} from "../state/Stand";
import {ConstructionYard} from "../building/ConstructionYard";

export class MCV extends Unit {
    private expanded: boolean = false;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(
            worldKnowledge,
            cellPosition,
            player,
            UnitProperties.getSprite(MCV.prototype.constructor.name, player.getId())
        );

        this.life = this.maxLife = UnitProperties.getLife(MCV.prototype.constructor.name);
    }

    updateStateAfterclick(cell: PIXI.Point) {
        if (!this.expanded) {
            const unit = this.worldKnowledge.getUnitAt(cell);
            if (null !== unit) {
                if (unit === this) {
                    this.state = new Stand(this);
                    this.expand();
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
            new ConstructionYard(new PIXI.Point(this.cellPosition.x - 1, this.cellPosition.y), this.player),
            true
        );
        this.worldKnowledge.removeUnit(this, 1000);
    }
}
