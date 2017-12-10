import {MovedSprite, Rotation} from "./MovedSprite";
import Play from "../state/Play";
import {BlockedSprite} from "./BlockedSprite";
import {StupidSprite} from "./StupidSprite";

const SPEED = 1;

export class GoaledSprite extends MovedSprite
{
    private spriteGoal: Phaser.Point = null;

    constructor(play: Play, x: number, y: number) {
        super(play, x, y, 'Tank5c', 10);

        this.life = 10000;
        this.maxLife = 10000;
        this.game.input.mouse.capture = true;
    }

    update()
    {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.spriteGoal = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        }

        if (null !== this.spriteGoal) {
            this.vector = new Phaser.Point(
                this.spriteGoal.x - this.x,
                this.spriteGoal.y - this.y
            );
            const directionLength = Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y);
            if (directionLength <= 1) {
                this.spriteGoal = null;
                this.vector = null;
            } else {
                if (directionLength > SPEED) {
                    this.vector.normalize();
                    this.vector.multiply(SPEED, SPEED);
                }
            }
        }

        super.update();
    }

    protected loadRotation(rotation: Rotation): void
    {
        switch(rotation) {
            case Rotation.TOP: this.loadTexture(this.spriteKey, 2); break;
            case Rotation.TOP_RIGHT: this.loadTexture(this.spriteKey, 4); break;
            case Rotation.RIGHT: this.loadTexture(this.spriteKey, 14); break;
            case Rotation.BOTTOM_RIGHT: this.loadTexture(this.spriteKey, 24); break;
            case Rotation.BOTTOM: this.loadTexture(this.spriteKey, 22); break;
            case Rotation.BOTTOM_LEFT: this.loadTexture(this.spriteKey, 20); break;
            case Rotation.LEFT: this.loadTexture(this.spriteKey, 10); break;
            case Rotation.TOP_LEFT: this.loadTexture(this.spriteKey, 0); break;
        }
    }

    protected isEnnemy(sprite: MovedSprite) {
        return sprite instanceof BlockedSprite || sprite instanceof StupidSprite;
    }
}
