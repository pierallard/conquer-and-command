import {Cell} from "../computing/Cell";
import {AbstractShootingBuilding} from "./AbstractShootingBuilding";
import {AdvancedGuardTowerSprite} from "../sprite/AdvancedGuardTowerSprite";

export class AdvancedGuardTower extends AbstractShootingBuilding {
    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new AdvancedGuardTowerSprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Artilery2'
        );
        super.create(game, group, effectsGroup);
    }
}
