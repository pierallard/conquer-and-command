import {BuildingSprite} from "./BuildingSprite";

export class PowerSprite extends BuildingSprite {
    private animationElec: Phaser.Animation;

    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.animationElec = this.animations.add(
            'toto',
            [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 11, 10, 9, 8, 5, 4, 3, 2, 1]
        );
        this.animationElec.play(10, true, false);
    }
}