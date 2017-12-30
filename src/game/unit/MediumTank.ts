import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MediumTank extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(
            worldKnowledge,
            cellPosition,
            player,
            UnitProperties.getSprite(MediumTank.prototype.constructor.name, player.getId())
        );

        this.life = this.maxLife = UnitProperties.getLife(MediumTank.prototype.constructor.name);
    }
}
