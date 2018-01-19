import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {WeaponsFactorySprite} from "../sprite/WeaponsFactorySprite";

export class WeaponsFactory extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new WeaponsFactorySprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Base'
        );
    }
}
