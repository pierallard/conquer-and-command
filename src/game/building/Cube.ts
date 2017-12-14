import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../Ground";
import {Building} from "./Building";

export class Cube extends Phaser.Sprite implements Building {
    private cellPosition: PIXI.Point;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Cube');

        this.frame = 2;
        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE * GROUND_SIZE / 27);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);
    }

    getCellWidth(): number {
        return 1;
    }

    getCellHeight(): number {
        return 1;
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }
}
