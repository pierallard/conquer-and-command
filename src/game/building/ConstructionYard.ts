import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {Player} from "../player/Player";
import {ConstructionYardSprite} from "../sprite/ConstructionYardSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class ConstructionYard extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new ConstructionYardSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'MinerAni'
        );
    }
}
