import {Cell} from "../computing/Cell";
import {AbstractShootingBuilding} from "./AbstractShootingBuilding";
import {AdvancedGuardTowerSprite} from "../sprite/AdvancedGuardTowerSprite";

export class AdvancedGuardTower extends AbstractShootingBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new AdvancedGuardTowerSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Artilery2'
        );
        super.create(game, groups);
    }
}
