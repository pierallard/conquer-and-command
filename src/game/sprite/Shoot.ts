import {SCALE} from "../game_state/Play";
import {Rotation} from "./UnitSprite";

export class Shoot extends Phaser.Sprite
{
    private firstFrame: number;

    constructor(game: Phaser.Game, x: number, y: number, rotation: Rotation) {
        super(game, x, y, 'ArtlFlsh');

        this.firstFrame = Shoot.getStartFrame(rotation);
        let explode = this.animations.add('explode');
        explode.play(10, false, true);
        explode.setFrame(this.firstFrame);
        explode.enableUpdate = true;
        explode.onUpdate.add(() => {
            if (explode.currentFrame.index >= this.firstFrame + 3) {
                explode.stop();
                explode.destroy();
            }
        });

        this.anchor.set(0.5 - Shoot.getAnchor(rotation)[0]*0.5, 0.5 + Shoot.getAnchor(rotation)[1] * 0.5);
        this.scale.setTo(SCALE, SCALE);
    }

    static getStartFrame(rotation: Rotation): number {
        switch(rotation) {
            case Rotation.TOP: return 8;
            case Rotation.TOP_RIGHT: return 34;
            case Rotation.RIGHT: return 42;
            case Rotation.BOTTOM_RIGHT: return 0;
            case Rotation.BOTTOM: return 12;
            case Rotation.BOTTOM_LEFT: return 4;
            case Rotation.LEFT: return 38;
            case Rotation.TOP_LEFT: return 30;
        }
    }

    static getAnchor(rotation: Rotation): number[] {
        switch(rotation) {
            case Rotation.TOP: return [0, 1];
            case Rotation.TOP_RIGHT: return [0.7, 0.7];
            case Rotation.RIGHT: return [1, 0];
            case Rotation.BOTTOM_RIGHT: return [0.7, -0.7];
            case Rotation.BOTTOM: return [0, -1];
            case Rotation.BOTTOM_LEFT: return [-0.7, -0.7];
            case Rotation.LEFT: return [-1, 0];
            case Rotation.TOP_LEFT: return [-0.7, 0.7];
        }
    }
}
