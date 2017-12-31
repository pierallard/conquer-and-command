import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";

export class Explosion extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number, size: number = null) {
        super(game, x, y, 'exploBig');

        let explode = this.animations.add('explode');
        explode.play(20, false, true);
        this.anchor.set(0.5, 0.5);

        const scale = size ? size / (SCALE * GROUND_SIZE) : SCALE / 1.5;
        this.scale.setTo(scale, scale);
    }
}
