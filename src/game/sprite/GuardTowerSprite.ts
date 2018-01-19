import {AbstractShootingBuildingSprite} from "./AbstractShootingBuildingSprite";

export class GuardTowerSprite extends AbstractShootingBuildingSprite {
    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.anchor.setTo(1 / 4, 3 / 4);
        this.lifeRectangle.setAnchor(1 / 4, 3 / 4);
        this.selectedRectangle.setAnchor(1 / 4, 3 / 4);
    }
}
