import {MovedSprite} from "./MovedSprite";
import {CIRCLE_RADIUS} from "../state/Play";
import {GoaledSprite} from "./GoaledSprite";
import {UnitRepository} from "../repository/UnitRepository";

const SPEED = 1;

export class StupidSprite extends MovedSprite
{
    private gameWidth: number;
    private gameHeight: number;

    constructor(unitRepository: UnitRepository, x: number, y: number) {
        super(unitRepository, x, y, 'Tank11', 5);
        this.gameWidth = unitRepository.play_.game.width;
        this.gameHeight = unitRepository.play_.game.height;
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
