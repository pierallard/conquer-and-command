import {Cell} from "../computing/Cell";
import {GuardTowerSprite} from "../sprite/GuardTowerSprite";
import {AbstractShootingBuilding} from "./AbstractShootingBuilding";

export class GuardTower extends AbstractShootingBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new GuardTowerSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Turret'
        );
        super.create(game, groups);
    }
}
