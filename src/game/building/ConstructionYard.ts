import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {Player} from "../player/Player";
import {ConstructionYardSprite} from "../sprite/ConstructionYardSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class ConstructionYard extends ConstructableBuilding {
    private minerals: number = 0;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new ConstructionYardSprite(
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
