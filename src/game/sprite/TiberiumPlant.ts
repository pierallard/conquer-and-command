import {Cell} from "../computing/Cell";
import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";
import {TiberiumSource} from "../building/TiberiumSource";

const START_AMOUNT = 100;
const HARVEST_QUANTITY = 10;

export class TiberiumPlant extends Phaser.Sprite {
    private source: TiberiumSource;
    private cellPosition: PIXI.Point;
    private amount: number;

    constructor(source: TiberiumSource, game: Phaser.Game, x: number, y: number) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'GrssMisc-2020', 18);

        this.source = source;
        this.amount = START_AMOUNT;
        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE * GROUND_SIZE / 27);
        this.anchor.setTo(0.5, 0.5);
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

    getSource(): TiberiumSource {
        return this.source;
    }
}
