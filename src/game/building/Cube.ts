import {Cell} from "../computing/Cell";
import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";

const START_AMOUNT = 100;
const HARVEST_QUANTITY = 10;

export class Cube extends Phaser.Sprite {
    private cellPosition: PIXI.Point;
    private amount: number;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Cube');

        this.amount = START_AMOUNT;
        this.frame = 2;
        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE * GROUND_SIZE / 27);
        this.anchor.setTo(0.5, 0.5);

        group.add(this);
    }

    getCellPositions(): PIXI.Point[] {
        return [this.cellPosition];
    }

    isEmpty() {
        return this.amount <= 0;
    }

    harvest(): number {
        let result = HARVEST_QUANTITY;
        if (this.amount < HARVEST_QUANTITY) {
            result = this.amount;
        }
        this.amount--;

        if (this.amount <= 0) {
            this.destroy();
        } else if (this.amount < START_AMOUNT / 3) {
            this.loadTexture(this.key, 0);
        } else if (this.amount < 2 * START_AMOUNT / 3) {
            this.loadTexture(this.key, 1);
        }

        return result;
    }
}
