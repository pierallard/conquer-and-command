import {AbstractShootingBuildingSprite} from "./AbstractShootingBuildingSprite";

export class AdvancedGuardTowerSprite extends AbstractShootingBuildingSprite {
    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.loadTexture(this.key, 4);
        this.anchor.setTo(3 / 8, 5 / 6);
        this.lifeRectangle.setAnchor(3 / 8, 5 / 6);
        this.selectedRectangle.setAnchor(3 / 8, 5 / 6);
    }
}
