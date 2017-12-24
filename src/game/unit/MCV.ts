import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../WorldKnowledge";

export class MCV extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(
            worldKnowledge,
            cellPosition,
            player,
            UnitProperties.getSprite(MCV.prototype.constructor.name, player.getId())
        );

        this.life = this.maxLife = UnitProperties.getLife(MCV.prototype.constructor.name);
    }

    getCellPositions(): PIXI.Point[] {
        return [
            this.cellPosition,
            new PIXI.Point(this.cellPosition.x + 1, this.cellPosition.y),
            new PIXI.Point(this.cellPosition.x + 1, this.cellPosition.y - 1),
            new PIXI.Point(this.cellPosition.x, this.cellPosition.y - 1),
        ];
    }
}
