import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {PowerPlantSprite} from "../sprite/PowerPlanSprite";

export class PowerPlant extends ConstructableBuilding {
    constructor(cell: PIXI.Point, player: Player) {
        super(cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new PowerPlantSprite(
            game,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Factory2'
        );
        group.add(this.sprite);
    }
}
