import {BuildingSprite} from "./BuildingSprite";

export class HelipadSprite extends BuildingSprite {
    private animationLoad: Phaser.Animation;
    private animationStand: Phaser.Animation;

    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectangle.setAnchor(1 / 4, 5 / 6);
        this.animationLoad = this.animations.add(
            'tata',
            [16, 14, 13, 12, 11, 10, 9, 8, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14]
        );
        this.animationStand = this.animations.add(
            'toto',
            [17, 18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18],
        );
        this.animationStand.play(10, true, false);
    }

    runLoadAnimation() {
        let animation = this.animationLoad.play(20, false, false);
        animation.onComplete.add(() => {
            this.animationStand.play(5, true, false);
        });
    }
}
