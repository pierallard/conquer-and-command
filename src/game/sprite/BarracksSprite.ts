import {BuildingSprite} from "./BuildingSprite";

export class BarracksSprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, effectsGroup, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectable.setAnchor(1 / 4, 5 / 6);
    }
}
