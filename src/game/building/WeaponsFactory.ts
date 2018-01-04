import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {WeaponsFactorySprite} from "../sprite/WeaponsFactorySprite";

export class WeaponsFactory extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new WeaponsFactorySprite(
            game,
            group,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Base'
        );
    }
}
