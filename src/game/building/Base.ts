import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";
import {Building} from "./Building";

export class Base extends Phaser.Sprite implements Building {
    private animationPump: Phaser.Animation;
    private animationElec: Phaser.Animation;
    private cellPosition: PIXI.Point;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Base');

        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE);
        this.anchor.setTo(1/6, 1/6);
        this.animationPump = this.animations.add('toto', [0,1,2,3,2,1]);
        this.animationElec = this.animations.add('toto', [5,6,7]);
        this.animationElec.play(10, true, false);
        this.game.add.existing(this);
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    getCellWidth(): number {
        return 3;
    }

    getCellHeight(): number {
        return 3;
    }
}
