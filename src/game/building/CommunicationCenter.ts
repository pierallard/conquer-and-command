import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {CommunicationCenterSprite} from "../sprite/CommunicationCenterSprite";
import {BuildingProperties} from "./BuildingProperties";

export class CommunicationCenter extends ConstructableBuilding {
    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new CommunicationCenterSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
    }
}
