import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class MediumTank extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }
}
