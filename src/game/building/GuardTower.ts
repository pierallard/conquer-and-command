import {AbstractShootingBuilding} from "./AbstractShootingBuilding";
import {Cell} from "../computing/Cell";
import {BuildingProperties} from "./BuildingProperties";
import {GuardTowerSprite} from "../sprite/GuardTowerSprite";

export class GuardTower extends AbstractShootingBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new GuardTowerSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
        super.create(game, groups);
    }
}
