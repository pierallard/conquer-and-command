import {BuildingSprite} from "./BuildingSprite";

export class ConstructionYardSprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, effectsGroup, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectable.setAnchor(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectable.setAnchor(1 / 4, 5 / 6);
        let animationOpen = this.animations.add(
            'toto',
            [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        );
        animationOpen.play(10, false, false);
        animationOpen.onComplete.add(() => {
            this.loadTexture(this.key, 19);
        });
    }
}
