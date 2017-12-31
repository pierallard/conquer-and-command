import {BuildingSprite} from "./BuildingSprite";

export class AdvancedPowerPlantSprite extends BuildingSprite {
    private animationElec: Phaser.Animation;

    constructor(game: Phaser.Game, group: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.animationElec = this.animations.add(
            'toto',
            [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14]
        );
        this.animationElec.play(10, true, false);
    }
}
