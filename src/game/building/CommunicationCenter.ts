import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {BarracksSprite} from "../sprite/BarracksSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {CommunicationCenterSprite} from "../sprite/CommunicationCenterSprite";

export class CommunicationCenter extends ConstructableBuilding {
    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
    }

    create(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group) {
        this.sprite = new CommunicationCenterSprite(
            game,
            group,
            effectsGroup,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Silo'
        );
    }
}
