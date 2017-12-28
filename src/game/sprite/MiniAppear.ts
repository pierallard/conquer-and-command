import {Cell} from "../computing/Cell";
import {SCALE} from "../game_state/Play";

const FRAME_RATE = 20;
const ANCHOR_X = 0.75;
const ANCHOR_Y = 0.6;

export class MiniAppear {
    private position: PIXI.Point;
    private game: Phaser.Game;
    private group: Phaser.Group;

    constructor(cellPosition: PIXI.Point) {
        this.position = new PIXI.Point(Cell.cellToReal(cellPosition.x), Cell.cellToReal(cellPosition.y));
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.group = group;
        this.buildSprite1();
    }

    buildSprite1() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Platform');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [
            4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            32, 33, 34,
        ], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite2.bind(this));
    }

    buildSprite2() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Creation');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        ], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
    }
}
