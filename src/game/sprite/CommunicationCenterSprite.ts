import {BuildingSprite} from "./BuildingSprite";

export class CommunicationCenterSprite extends BuildingSprite {
    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.anchor.setTo(1 / 4, 5 / 6);
        this.lifeRectangle.setAnchor(1 / 4, 5 / 6);
        this.selectedRectangle.setAnchor(1 / 4, 5 / 6);
    }
}
