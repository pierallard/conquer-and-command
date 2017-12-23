import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {UnitProperties} from "./UnitProperties";

export class Tank extends Unit {
    constructor(player: Player, x: number, y: number, group: Phaser.Group) {
        super(player, x, y, group, UnitProperties.getSprite(Tank.prototype.constructor.name, player.getId()));

        this.life = this.maxLife = UnitProperties.getLife(Tank.prototype.constructor.name);
    }
}
