import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {TiberiumRefinerySprite} from "../sprite/TiberiumRefinerySprite";

export class TiberiumRefinery extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new TiberiumRefinerySprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Factory3'
        );
    }

    runUnloadAnimation() {
        (<TiberiumRefinerySprite> this.sprite).runUnloadAnimation();
    }
}
