import {SCALE} from "../game_state/Play";
import {ROTATION} from "../computing/Rotation";

export class Shoot extends Phaser.Sprite {
    static getStartFrame(rotation: ROTATION): number {
        switch (rotation) {
            case ROTATION.TOP: return 8;
            case ROTATION.TOP_RIGHT: return 34;
            case ROTATION.RIGHT: return 42;
            case ROTATION.BOTTOM_RIGHT: return 0;
            case ROTATION.BOTTOM: return 12;
            case ROTATION.BOTTOM_LEFT: return 4;
            case ROTATION.LEFT: return 38;
            case ROTATION.TOP_LEFT: return 30;
        }
    }

    static getAnchor(rotation: ROTATION): number[] {
        switch (rotation) {
            case ROTATION.TOP: return [0, 1];
            case ROTATION.TOP_RIGHT: return [0.7, 0.7];
            case ROTATION.RIGHT: return [1, 0];
            case ROTATION.BOTTOM_RIGHT: return [0.7, -0.7];
            case ROTATION.BOTTOM: return [0, -1];
            case ROTATION.BOTTOM_LEFT: return [-0.7, -0.7];
            case ROTATION.LEFT: return [-1, 0];
            case ROTATION.TOP_LEFT: return [-0.7, 0.7];
        }
    }

    private firstFrame: number;

    constructor(game: Phaser.Game, x: number, y: number, rotation: ROTATION) {
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

        this.anchor.set(0.5 - Shoot.getAnchor(rotation)[0] * 0.5, 0.5 + Shoot.getAnchor(rotation)[1] * 0.5);
        this.scale.setTo(SCALE, SCALE);
    }

}
