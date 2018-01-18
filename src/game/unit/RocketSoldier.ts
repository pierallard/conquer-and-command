import {Unit} from "./Unit";
import {Rotation} from "../computing/Rotation";
import {Cell} from "../computing/Cell";

export class RocketSoldier extends Unit {
    protected getShootSource(cellDest: PIXI.Point): PIXI.Point {
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellDest.x - this.cellPosition.x,
            cellDest.y - this.cellPosition.y
        ));
        const angle = rotation / 8 * 2 * Math.PI;
        const dist = 12;
        return new PIXI.Point(
            Cell.cellToReal(this.cellPosition.x) + Math.cos(angle) * dist,
            Cell.cellToReal(this.cellPosition.y) - Math.sin(angle) * dist
        );
    }
}
