import Play from "./state/Play";
import {MovedSprite} from "./sprite/MovedSprite";
import {GoaledSprite} from "./sprite/GoaledSprite";
export class Selector extends Phaser.Graphics
{
    private corner: Phaser.Point = null;
    private play_: Play;
    private selectedEntities: MovedSprite[] = [];

    constructor(play: Play) {
        super(play.game, 0, 0);

        this.play_ = play;
        this.game.input.mouse.capture = true;
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    }

    update()
    {
        if (null === this.corner && this.game.input.activePointer.leftButton.isDown) {
            this.corner = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        }

        if (this.corner !== null && this.game.input.activePointer.leftButton.isUp) {
            this.selectedEntities = [];
            this.play_.getMovedSprites().forEach((sprite) => {
                const isInside = this.isInside(sprite);
                if (isInside) {
                    this.selectedEntities.push(sprite);
                }
                sprite.setSelected(isInside);
            });
            this.corner = null;
            this.clear();
        }

        if (null !== this.corner) {
            this.clear();
            this.beginFill(0x00ff00);
            this.alpha = 0.5;
            this.drawRect(
                this.corner.x,
                this.corner.y,
                this.game.input.mousePointer.x - this.corner.x,
                this.game.input.mousePointer.y - this.corner.y
            )
        }
    }

    private isInside(sprite: MovedSprite) {
        if (!(sprite instanceof GoaledSprite)) {
            return false;
        }
        const left = Math.min(this.corner.x, this.game.input.mousePointer.x);
        const right = Math.max(this.corner.x, this.game.input.mousePointer.x);
        const top = Math.min(this.corner.y, this.game.input.mousePointer.y);
        const bottom = Math.max(this.corner.y, this.game.input.mousePointer.y);

        return (
            sprite.x - sprite.width/2 > left &&
            sprite.x + sprite.width/2 < right &&
            sprite.y - sprite.height/2 > top &&
            sprite.y + sprite.height/2 < bottom
        );
    }
}
