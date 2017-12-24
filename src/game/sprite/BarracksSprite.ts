import {BuildingSprite} from "./BuildingSprite";

export class BarracksSprite extends BuildingSprite {
    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
    }
}
