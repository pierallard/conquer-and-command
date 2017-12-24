import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";

const FRAME_RATE = 20;
const ANCHOR_X = 3 / 8;
const ANCHOR_Y = 6.5 / 8;

export class Appear {
    private game: Phaser.Game;
    private position: PIXI.Point;

    constructor(game: Phaser.Game, cellX: number, cellY: number) {
        this.game = game;
        this.position = new PIXI.Point(Cell.cellToReal(cellX), Cell.cellToReal(cellY));
        this.buildSprite1();
    }

    buildSprite1() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build1');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite2.bind(this));
    }

    buildSprite2() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build2');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite3.bind(this));
    }

    buildSprite3() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build3');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite4.bind(this));
    }

    buildSprite4() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build4');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite5.bind(this));
    }

    buildSprite5() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build5');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite6.bind(this));
    }

    buildSprite6() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build6');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite7.bind(this));
    }

    buildSprite7() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build7');
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
    }
}
