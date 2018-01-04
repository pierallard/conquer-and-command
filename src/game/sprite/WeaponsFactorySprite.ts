import {BuildingSprite} from "./BuildingSprite";

export class WeaponsFactorySprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        let animationOpen = this.animations.add(
            'toto',
            [5, 6, 7]
        );
        animationOpen.play(10, true, false);
    }
}
