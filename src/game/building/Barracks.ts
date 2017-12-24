import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {BarracksSprite} from "../sprite/BarracksSprite";
import {WorldKnowledge} from "../WorldKnowledge";

export class Barracks extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
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
