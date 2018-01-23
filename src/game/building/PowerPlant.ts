import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {PowerPlantSprite} from "../sprite/PowerPlantSprite";
import {BuildingProperties} from "./BuildingProperties";

export class PowerPlant extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new PowerPlantSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
    }
}
