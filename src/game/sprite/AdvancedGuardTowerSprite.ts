import {AbstractShootingBuildingSprite} from "./AbstractShootingBuildingSprite";

export class AdvancedGuardTowerSprite extends AbstractShootingBuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, effectsGroup, x, y, key);
        this.group = group;
        this.loadTexture(this.key, 4);
        this.anchor.setTo(3 / 8, 5 / 6);
    }
}
