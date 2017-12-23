import {Cell} from "../Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {Unit} from "../unit/Unit";
import {Harvester} from "../unit/Harvester";
import {Player} from "../player/Player";
import {BaseSprite} from "../sprite/BaseSprite";

export class Base extends ConstructableBuilding {
    private minerals: number = 0;
    private group: Phaser.Group;

    constructor(game: Phaser.Game, x: number, y: number, group: Phaser.Group, player: Player) {
        super();

        this.sprite = new BaseSprite(game, Cell.cellToReal(x), Cell.cellToReal(y), 'Base');
        group.add(this.sprite);

        this.player = player;
        this.group = group;
        this.cellPosition = new PIXI.Point(x, y);
    }

    addMinerals(loading: number) {
        this.minerals += loading;
    }

    private buildHarvester(): Unit {
        return new Harvester(
            this.player,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            this.group
        );
    }
}
