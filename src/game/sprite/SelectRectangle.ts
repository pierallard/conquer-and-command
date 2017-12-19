const SELECT_SIZE = 3;

export class SelectRectangle extends Phaser.Graphics {
    private unitWidth: number;
    private unitHeight: number;
    private isVisible: boolean = false;

    constructor(game: Phaser.Game, width: number, height: number) {
        super(game, 0, 0);

        this.unitWidth = width;
        this.unitHeight = height;
        this.game.add.existing(this);
    }

    render() {
        this.clear();
        if (this.isVisible) {
            this.lineStyle(1, 0xffffff, 1);
            this.moveTo(-this.unitWidth / 2, -this.unitHeight / 2 + SELECT_SIZE);
            this.lineTo(-this.unitWidth / 2, -this.unitHeight / 2);
            this.lineTo(-this.unitWidth / 2 + SELECT_SIZE, -this.unitHeight / 2);
            this.moveTo(this.unitWidth / 2 - SELECT_SIZE, -this.unitHeight / 2);
            this.lineTo(this.unitWidth / 2, -this.unitHeight / 2);
            this.lineTo(this.unitWidth / 2, -this.unitHeight / 2 + SELECT_SIZE);
            this.moveTo(this.unitWidth / 2, this.unitHeight / 2 - SELECT_SIZE);
            this.lineTo(this.unitWidth / 2, this.unitHeight / 2);
            this.lineTo(this.unitWidth / 2 - SELECT_SIZE, this.unitHeight / 2);
            this.moveTo(-this.unitWidth / 2 + SELECT_SIZE, this.unitHeight / 2);
            this.lineTo(-this.unitWidth / 2, this.unitHeight / 2);
            this.lineTo(-this.unitWidth / 2, this.unitHeight / 2 - SELECT_SIZE);
        }
    }

    setVisible(value: boolean) {
        this.isVisible = value;
        this.render();
    }
}
