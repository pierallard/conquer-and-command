import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {TiberiumRefinerySprite} from "../sprite/TiberiumRefinerySprite";

export class TiberiumRefinery extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new TiberiumRefinerySprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Factory3'
        );
    }

    runUnloadAnimation() {
        (<TiberiumRefinerySprite> this.sprite).runUnloadAnimation();
    }
}
