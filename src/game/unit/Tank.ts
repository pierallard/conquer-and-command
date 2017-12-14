import {Unit} from "./Unit";
import {Player} from "../player/Player";

export class Tank extends Unit {
    constructor(player: Player, x: number, y: number) {
        super(player, x, y, player.getTankKey());
    }
}
