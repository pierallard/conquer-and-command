import {Unit} from "./Unit";
import {Player} from "../player/Player";

const SHOOT_DISTANCE = 4;

export class Tank extends Unit {
    constructor(player: Player, x: number, y: number) {
        super(player, x, y, player.getTankKey());
    }

    getShootDistance(): number {
        return SHOOT_DISTANCE;
    }
}
