import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Rotation} from "../computing/Rotation";
import {Cell} from "../computing/Cell";

export class RocketSoldier extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }

    protected getShootSource(cellDest: PIXI.Point): PIXI.Point {
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellDest.x - this.cellPosition.x,
            cellDest.y - this.cellPosition.y
        ));
        const angle = rotation / 8 * 2 * Math.PI;
        const dist = 10;
        return new PIXI.Point(
            Cell.cellToReal(this.cellPosition.x) + Math.cos(angle) * dist,
            Cell.cellToReal(this.cellPosition.y) - Math.sin(angle) * dist
        );
    }
}
