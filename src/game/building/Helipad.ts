import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {HelipadSprite} from "../sprite/HelipadSprite";

export class Helipad extends ConstructableBuilding {
    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new HelipadSprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Starport'
        );
    }
}
