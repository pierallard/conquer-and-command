import {MovedSprite} from "./sprite/MovedSprite";
import {GoaledSprite} from "./sprite/GoaledSprite";
import {UnitRepository} from "./repository/UnitRepository";
import {AStarSprite} from "./sprite/AStarSprite";
import {Player} from "./Player";
export class Selector extends Phaser.Graphics
{
    private corner: Phaser.Point = null;
    private unitRepository: UnitRepository;
    private player: Player;

    constructor(game: Phaser.Game, unitRepository: UnitRepository, player: Player) {
        super(game, 0, 0);

        this.unitRepository = unitRepository;
        this.game.input.mouse.capture = true;
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        this.player = player;
    }

    update()
    {
        if (null === this.corner && this.game.input.activePointer.leftButton.isDown) {
            this.corner = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        }

        if (this.corner !== null && this.game.input.activePointer.leftButton.isUp) {
            this.unitRepository.getUnits().forEach((unit) => {
                let isInside = false;
                if ((<AStarSprite> unit).getPlayer() === this.player) {
                    isInside = this.isInside(unit);
                }
                unit.setSelected(isInside);
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
        if (!(sprite instanceof GoaledSprite || sprite instanceof AStarSprite)) {
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
