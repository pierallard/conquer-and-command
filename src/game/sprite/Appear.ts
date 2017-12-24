import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";

const FRAME_RATE = 20;
const ANCHOR_X = 3 / 8;
const ANCHOR_Y = 6.5 / 8;

export class Appear {
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
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build1');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite2.bind(this));
    }

    buildSprite2() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build2');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite3.bind(this));
    }

    buildSprite3() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build3');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite4.bind(this));
    }

    buildSprite4() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build4');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite5.bind(this));
    }

    buildSprite5() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build5');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite6.bind(this));
    }

    buildSprite6() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build6');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
        spriteAnim.onComplete.add(this.buildSprite7.bind(this));
    }

    buildSprite7() {
        let sprite = this.game.add.sprite(this.position.x, this.position.y, 'Build7');
        this.group.add(sprite);
        sprite.scale.setTo(SCALE, SCALE);
        sprite.anchor.setTo(ANCHOR_X, ANCHOR_Y);
        let spriteAnim = sprite.animations.add('toto', [0, 1, 2, 3, 4, 5, 6, 7], FRAME_RATE);
        spriteAnim.play(FRAME_RATE, false, true);
    }
}
