import {BuildingSprite} from "./BuildingSprite";

export class TiberiumRefinerySprite extends BuildingSprite {
    private animationElec: Phaser.Animation;
    private animationPump: Phaser.Animation;

    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectangle.setAnchor(1 / 4, 5 / 6);
        this.animationElec = this.animations.add(
            'toto',
            [4, 5, 8, 9, 10, 9, 8, 5]
        );
        this.animationPump = this.animations.add(
            'toto',
            [0, 1, 2, 3, 2, 1],
        );
        this.animationPump.play(5, true, false);
    }

    runUnloadAnimation() {
        let animation = this.animationElec.play(10, false, false);
        animation.onComplete.add(() => {
            this.animationPump.play(5, true, false);
        });
    }
}
