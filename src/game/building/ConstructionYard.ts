import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {Player} from "../player/Player";
import {ConstructionYardSprite} from "../sprite/ConstructionYardSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class ConstructionYard extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }

    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new ConstructionYardSprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'MinerAni'
        );
    }
}
