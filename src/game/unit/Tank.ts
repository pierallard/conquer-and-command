import {Unit} from "./Unit";
import {Player} from "../player/Player";

const SHOOT_DISTANCE = 4;

export class Tank extends Unit {
    constructor(player: Player, x: number, y: number, group: Phaser.Group) {
        super(player, x, y, group, player.getTankKey());
        this.life = 500;
        this.maxLife = 500;
    }

    getShootDistance(): number {
        return SHOOT_DISTANCE;
    }
}
