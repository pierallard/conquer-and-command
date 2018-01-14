import {AbstractShootingBuildingSprite} from "./AbstractShootingBuildingSprite";

export class GuardTowerSprite extends AbstractShootingBuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, effectsGroup, x, y, key);
        this.group = group;
        this.anchor.setTo(1 / 4, 3 / 4);
        this.lifeRectangle.setAnchor(1 / 4, 3 / 4);
        this.selectedRectable.setAnchor(1 / 4, 3 / 4);
    }
}
