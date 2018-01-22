import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {HelipadSprite} from "../sprite/HelipadSprite";

export class Helipad extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new HelipadSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Starport'
        );
    }

    runLoadAnimation() {
        (<HelipadSprite> this.sprite).runLoadAnimation();
    }
}
