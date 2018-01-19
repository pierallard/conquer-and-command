import {GROUND_SIZE} from "../map/Ground";

const SQUARE_SIZE = 4;

export class ShotCounter extends Phaser.Graphics {
    private max: number;
    private counter: number;
    private isVisible: boolean;

    constructor(game: Phaser.Game, max: number) {
        super(game, 0, 0);
        this.game.add.existing(this);

        this.max = max;
        this.isVisible = false;
        this.counter = max;
        this.render();
    }

    render() {
        this.clear();
        if (this.isVisible) {
            this.lineStyle(null);
            this.beginFill(0x00ff00, 1);
            for (let i = 0; i < this.counter; i++) {
                this.drawRect(GROUND_SIZE / 2 - i * SQUARE_SIZE, GROUND_SIZE / 2, -SQUARE_SIZE, SQUARE_SIZE);
            }
            this.endFill();

            this.lineStyle(1, 0xffffff, 1);
            for (let i = 0; i < this.max; i++) {
                this.drawRect(GROUND_SIZE / 2 - i * SQUARE_SIZE, GROUND_SIZE / 2, -SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }

    setVisible(value: boolean) {
        this.isVisible = value;
        this.render();
    }

    updateCounter(counter: number) {
        this.counter = counter;
        this.render();
    }
}
