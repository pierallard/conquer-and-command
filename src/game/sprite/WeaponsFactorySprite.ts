import {BuildingSprite} from "./BuildingSprite";

export class WeaponsFactorySprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, effectsGroup, x, y, key);
        this.anchor.setTo(1 / 6, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 6, 5 / 6);
        this.selectedRectable.setAnchor(1 / 6, 5 / 6);
        let animationOpen = this.animations.add(
            'toto',
            [5, 6, 7]
        );
        animationOpen.play(10, true, false);
    }
}
