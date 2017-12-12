import {MovedSprite} from "../sprite/MovedSprite";
import {GoaledSprite} from "../sprite/GoaledSprite";
import {StupidSprite} from "../sprite/StupidSprite";
import {BlockedSprite} from "../sprite/BlockedSprite";
import Play, {CIRCLE_RADIUS} from "../state/Play";
import {AStarSprite} from "../sprite/AStarSprite";

const ACCELERATION = 10;

export class UnitRepository
{
    private units: MovedSprite[];
    public play_: Play;

    constructor(play_: Play)
    {
        this.play_ = play_;
        this.units = [];
    }

    public generateRandomUnits()
    {
        // for (let i = 0; i < 3; i++) {
        //     this.units.push(new GoaledSprite(
        //         this,
        //         Math.random() * this.play_.game.width,
        //         Math.random() * this.play_.game.height
        //     ));
        // }
        // for (let i = 0; i < 20; i++) {
        //     this.units.push(new StupidSprite(
        //         this,
        //         Math.random() * this.play_.game.width,
        //         Math.random() * this.play_.game.height
        //     ));
        // }
        // for (let i = 0; i < 30; i++) {
        //     this.units.push(new BlockedSprite(this,
        //         Math.random() * this.play_.game.width,
        //         Math.random() * this.play_.game.height
        //     ));
        // }
        for (let i = 0; i < 50; i++) {
            this.units.push(new AStarSprite(
                this,
                Math.random() * this.play_.game.width,
                Math.random() * this.play_.game.height,
                this.play_.ground
            ));
        }
    }

    getUnits(): MovedSprite[] {
        return this.units;
    }

    removeSprite(movedSprite: MovedSprite) {
        const index = this.units.indexOf(movedSprite);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    update(): void
    {
        /*
        let moves = [];
        for (let i = 0; i < this.units.length; i++) {
            moves[i] = new Phaser.Point(0, 0);
        }

        for (let i = 0; i < this.units.length; i++) {
            for (let j = i+1; j < this.units.length; j++) {
                let vectorBetween = new Phaser.Point(
                    this.units[i].x - this.units[j].x,
                    this.units[i].y - this.units[j].y
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
                    if (this.units[i].getWeight() > this.units[j].getWeight()) {
                        strong = 2 - strong;
                    }

                    moves[i].x = (moves[i].x * ACCELERATION + vectorBetween.x * strong) / (ACCELERATION + 1);
                    moves[i].y = (moves[i].y * ACCELERATION + vectorBetween.y * strong) / (ACCELERATION + 1);
                    moves[j].x = (moves[j].x * ACCELERATION - vectorBetween.x * (2 - strong)) / (ACCELERATION + 1);
                    moves[j].y = (moves[j].y * ACCELERATION - vectorBetween.y * (2 - strong)) / (ACCELERATION + 1);
                }
            }
        }

        for (let i = 0; i < this.units.length; i++) {
            this.units[i].x += moves[i].x;
            this.units[i].y += moves[i].y;
        }*/
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return null === this.unitAt(position)
    }

    unitAt(position: PIXI.Point): AStarSprite {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i] instanceof AStarSprite) {
                if (
                    (<AStarSprite> this.units[i]).getCellPosition().x === position.x &&
                    (<AStarSprite> this.units[i]).getCellPosition().y === position.y
                ) {
                    return (<AStarSprite> this.units[i]);
                }
            }
        }

        return null;
    }
}
