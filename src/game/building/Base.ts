import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";
import {Building} from "./Building";

export class Base extends Phaser.Sprite implements Building {
    private animationPump: Phaser.Animation;
    private animationElec: Phaser.Animation;
    private cellPosition: PIXI.Point;
    private minerals: number = 0;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Base');

        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE);
        this.anchor.setTo(1/6, 1/6);
        this.animationPump = this.animations.add('toto', [0,1,2,3,2,1]);
        this.animationElec = this.animations.add('toto', [5,6,7]);
        this.animationElec.play(10, true, false);

        group.add(this);
    }

    addMinerals(loading: number) {
        this.minerals += loading;
    }

    getCellPositions(): PIXI.Point[] {
        return [
            this.cellPosition,
            new PIXI.Point(this.cellPosition.x + 1, this.cellPosition.y),
            new PIXI.Point(this.cellPosition.x + 2, this.cellPosition.y),
            new PIXI.Point(this.cellPosition.x, this.cellPosition.y + 1),
            new PIXI.Point(this.cellPosition.x + 1, this.cellPosition.y + 1),
            new PIXI.Point(this.cellPosition.x + 2, this.cellPosition.y + 1),
            new PIXI.Point(this.cellPosition.x, this.cellPosition.y + 2),
            new PIXI.Point(this.cellPosition.x + 1, this.cellPosition.y + 2),
            new PIXI.Point(this.cellPosition.x + 2, this.cellPosition.y + 2),
        ];
    }

    build(unit: string): void {
    }
}
