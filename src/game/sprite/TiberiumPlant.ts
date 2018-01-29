import {Cell} from "../computing/Cell";
import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";
import {TiberiumSource} from "../building/TiberiumSource";

const START_AMOUNT = 2000;
const HARVEST_QUANTITY = 100;

export class TiberiumPlant extends Phaser.Sprite {
    private static getLayerFromAmount(amount): number {
        if (amount < START_AMOUNT / 3) {
            return 4;
        } else if (amount < 2 * START_AMOUNT / 3) {
            return 2;
        } else {
            return 0;
        }
    }

    private source: TiberiumSource;
    private cellPosition: PIXI.Point;
    private amount: number;

    constructor(source: TiberiumSource, game: Phaser.Game, x: number, y: number) {
        const amount = Math.random() * (START_AMOUNT / 2) + START_AMOUNT / 2;
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'GrssCrtr', TiberiumPlant.getLayerFromAmount(amount));

        this.source = source;
        this.amount = amount;
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
        this.amount -= result;

        if (this.amount <= 0) {
            this.destroy();
            this.source.remove(this);
        } else {
            this.loadTexture(this.key, TiberiumPlant.getLayerFromAmount(this.amount));
        }

        return result;
    }

    getSource(): TiberiumSource {
        return this.source;
    }
}
