import {BuildingSprite} from "./BuildingSprite";

export class BarracksSprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
    }
}
