import {BuildingSprite} from "./BuildingSprite";

export class BaseSprite extends BuildingSprite {
    private animationPump: Phaser.Animation;
    private animationElec: Phaser.Animation;

    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);
        this.anchor.setTo(1 / 6, 5 / 6);
        this.animationPump = this.animations.add('toto', [0, 1, 2, 3, 2, 1]);
        this.animationElec = this.animations.add('toto', [5, 6, 7]);
        this.animationElec.play(10, true, false);
    }
}
