import {Cell} from "../Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {PowerPlantSprite} from "../sprite/PowerPlanSprite";
import {Appear} from "../sprite/Appear";

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
        this.sprite.alpha = 0;
        group.add(this.sprite);

        let appear = new Appear(this.cellPosition);
        appear.create(game, group);
        game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.sprite.alpha = 1;
        }, this);
    }
}
