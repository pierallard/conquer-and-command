import {SCALE} from "../state/Play";

export class Explosion extends Phaser.Sprite
{
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'exploBig');

        let explode = this.animations.add('explode');
        explode.play(20, false, true);
        this.anchor.set(0.5, 0.5);
        this.scale.setTo(SCALE / 1.5, SCALE / 1.5);
    }
}
