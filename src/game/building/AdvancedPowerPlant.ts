import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {AdvancedPowerPlantSprite} from "../sprite/AdvancedPowerPlantSprite";

export class AdvancedPowerPlant extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new AdvancedPowerPlantSprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Generator'
        );
    }
}
