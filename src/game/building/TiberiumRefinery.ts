import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {TiberiumRefinerySprite} from "../sprite/TiberiumRefinerySprite";
import {BuildingProperties} from "./BuildingProperties";

export class TiberiumRefinery extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new TiberiumRefinerySprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
    }

    runUnloadAnimation() {
        (<TiberiumRefinerySprite> this.sprite).runUnloadAnimation();
    }
}
