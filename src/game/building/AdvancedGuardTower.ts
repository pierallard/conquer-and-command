import {Cell} from "../computing/Cell";
import {AbstractShootingBuilding} from "./AbstractShootingBuilding";
import {AdvancedGuardTowerSprite} from "../sprite/AdvancedGuardTowerSprite";
import {BuildingProperties} from "./BuildingProperties";

export class AdvancedGuardTower extends AbstractShootingBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new AdvancedGuardTowerSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
        super.create(game, groups);
    }
}
