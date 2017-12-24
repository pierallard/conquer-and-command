import {Cell} from "../Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {BarracksSprite} from "../sprite/BarracksSprite";

export class Barracks extends ConstructableBuilding {
    constructor(cell: PIXI.Point, player: Player) {
        super(cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new BarracksSprite(
            game,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Module'
        );
        group.add(this.sprite);
    }
}
