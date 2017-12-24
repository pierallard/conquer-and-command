import {Cell} from "../Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {Player} from "../player/Player";
import {BaseSprite} from "../sprite/BaseSprite";

export class Base extends ConstructableBuilding {
    private minerals: number = 0;

    constructor(cellPosition: PIXI.Point, player: Player) {
        super(cellPosition, player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new BaseSprite(
            game,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Base'
        );
        group.add(this.sprite);
    }

    addMinerals(loading: number) {
        this.minerals += loading;
    }
}
