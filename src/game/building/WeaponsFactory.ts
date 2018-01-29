import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WeaponsFactorySprite} from "../sprite/WeaponsFactorySprite";
import {BuildingProperties} from "./BuildingProperties";

export class WeaponsFactory extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new WeaponsFactorySprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
    }
}
