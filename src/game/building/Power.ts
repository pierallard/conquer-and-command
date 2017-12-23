import {Cell} from "../Cell";
import {Player} from "../player/Player";
import {Tank} from "../unit/Tank";
import {Unit} from "../unit/Unit";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {PowerSprite} from "../sprite/PowerSprite";

export class Power extends ConstructableBuilding {
    private group: Phaser.Group;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group, player: Player) {
        super();

        this.sprite = new PowerSprite(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Factory2');

        this.group = group;
        this.player = player;
        this.cellPosition = new PIXI.Point(x, y);

        group.add(this.sprite);
    }

    private buildTank(): Unit {
        return new Tank(
            this.player,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            this.group
        );
    }
}
