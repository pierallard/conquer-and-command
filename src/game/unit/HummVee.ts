import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Rotation} from "../computing/Rotation";
import {Cell} from "../computing/Cell";

export class HummVee extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }
}
