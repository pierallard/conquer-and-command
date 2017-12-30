import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MinigunInfantry extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(
            worldKnowledge,
            cellPosition,
            player,
            UnitProperties.getSprite(MinigunInfantry.prototype.constructor.name, player.getId())
        );

        this.life = this.maxLife = UnitProperties.getLife(MinigunInfantry.prototype.constructor.name);
    }
}
