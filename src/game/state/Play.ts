import {MovedSprite} from "../sprite/MovedSprite";
import {StupidSprite} from "../sprite/StupidSprite";
import {BlockedSprite} from "../sprite/BlockedSprite";
import {Explosion} from "../sprite/Explosion";
import {Selector} from "../Selector";
import {GoaledSprite} from "../sprite/GoaledSprite";


export const SCALE = 2;
export const CIRCLE_RADIUS: number = 19 * SCALE;

export default class Play extends Phaser.State
{
    private sprites: MovedSprite[];
    private selector: Selector;

    public create()
    {
        this.sprites = [];
        this.selector = new Selector(this);
        this.game.add.existing(this.selector);

        for (let i = 0; i < 20; i++) {
            this.sprites.push(new GoaledSprite(this, Math.random() * this.game.width, Math.random() * this.game.height));
        }
        for (let i = 0; i < 20; i++) {
            this.sprites.push(new StupidSprite(this, Math.random() * this.game.width, Math.random() * this.game.height));
        }
        for (let i = 0; i < 10; i++) {
            this.sprites.push(new BlockedSprite(this, Math.random() * this.game.width, Math.random() * this.game.height));
        }
    }

    public update()
    {
        let moves = [];
        for (let i = 0; i < this.sprites.length; i++) {
            moves[i] = new Phaser.Point(0, 0);
        }

        for (let i = 0; i < this.sprites.length; i++) {
            for (let j = i+1; j < this.sprites.length; j++) {
                let vectorBetween = new Phaser.Point(
                    this.sprites[i].x - this.sprites[j].x,
                    this.sprites[i].y - this.sprites[j].y
                );
                const distance = Math.sqrt(vectorBetween.x * vectorBetween.x + vectorBetween.y * vectorBetween.y);

                if (distance < CIRCLE_RADIUS) {
                    if (vectorBetween.x === 0 && vectorBetween.y === 0) {
                        vectorBetween = new Phaser.Point(Math.random(), Math.random());
                    }

                    vectorBetween.normalize();
                    const moveDistance = (CIRCLE_RADIUS - distance);
                    vectorBetween.multiply(moveDistance, moveDistance);

                    let strong = 1.5;
                    if (this.sprites[i].getWeight() > this.sprites[j].getWeight()) {
                        strong = 2 - strong;
                    }

                    moves[i].x = moves[i].x + vectorBetween.x * strong;
                    moves[i].y = moves[i].y + vectorBetween.y * strong;
                    moves[j].x = moves[j].x - vectorBetween.x * (2 - strong);
                    moves[j].y = moves[j].y - vectorBetween.y * (2 - strong);
                }
            }
        }

        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].x += moves[i].x;
            this.sprites[i].y += moves[i].y;
        }
    }

    public render()
    {
    }

    getMovedSprites(): MovedSprite[] {
        return this.sprites;
    }

    removeSprite(movedSprite: MovedSprite) {
        this.game.add.existing(new Explosion(this.game, movedSprite.x, movedSprite.y));
        const index = this.sprites.indexOf(movedSprite);
        if (index > -1) {
            this.sprites.splice(index, 1);
        }
    }
}
