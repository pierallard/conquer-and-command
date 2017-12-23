import {Cell} from "../Cell";
import {SCALE} from "../game_state/Play";
import {Player} from "../player/Player";
import {Tank} from "../unit/Tank";
import {Unit} from "../unit/Unit";
import {ConstructableBuilding} from "./ConstructableBuilding";

export class Power extends ConstructableBuilding {
    private animationElec: Phaser.Animation;
    private group: Phaser.Group;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group, player: Player) {
        super(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Factory2');

        this.group = group;
        this.player = player;
        this.cellPosition = new PIXI.Point(x, y);
        this.scale.setTo(SCALE);
        this.anchor.setTo(1 / 4, 3 / 6);
        this.animationElec = this.animations.add(
            'toto',
            [0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 11, 10, 9, 8, 5, 4, 3, 2, 1]
        );
        this.animationElec.play(10, true, false);

        group.add(this);
    }

    private buildTank(): Unit {
        return new Tank(
            this.player,
            this.x,
            this.y,
            this.group
        );
    }
}
