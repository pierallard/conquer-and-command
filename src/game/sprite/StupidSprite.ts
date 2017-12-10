import {MovedSprite} from "./MovedSprite";
import Play, {CIRCLE_RADIUS} from "../state/Play";
import {GoaledSprite} from "./GoaledSprite";

const SPEED = 1;

export class StupidSprite extends MovedSprite
{
    private gameWidth: number;
    private gameHeight: number;

    constructor(play: Play, x: number, y: number) {
        super(play, x, y, 'Tank11', 5);
        this.gameWidth = play.game.width;
        this.gameHeight = play.game.height;
        this.vector = new Phaser.Point(Math.random() > 0.5 ? SPEED : -SPEED, Math.random() > 0.5 ? SPEED : -SPEED);
    }

    update()
    {
        if (this.x >= (this.gameWidth - CIRCLE_RADIUS/2)) {
            this.vector.x = -SPEED;
        } else if (this.x <= CIRCLE_RADIUS/2) {
            this.vector.x = SPEED;
        }
        if (this.y >= (this.gameHeight - CIRCLE_RADIUS/2)) {
            this.vector.y = -SPEED;
        } else if (this.y <= CIRCLE_RADIUS/2) {
            this.vector.y = SPEED;
        }

        super.update();
    }

    protected isEnnemy(sprite: MovedSprite) {
        return sprite instanceof GoaledSprite;
    }
}
