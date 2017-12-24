import {Building} from "./Building";
import {Player} from "../player/Player";
import {BuildingProperties} from "./BuildingProperties";
import {BuildingSprite} from "../sprite/BuildingSprite";

export abstract class ConstructableBuilding implements Building {
    protected player: Player;
    protected cellPosition: PIXI.Point;
    protected sprite: BuildingSprite;

    constructor(cellPosition: PIXI.Point, player: Player) {
        this.cellPosition = cellPosition;
        this.player = player;
    }

    abstract create(game: Phaser.Game, group: Phaser.Group): void;

    setVisible(value: boolean) {
        this.sprite.alpha = value ? 1 : 0;
    }

    getCellPositions(): PIXI.Point[] {
        return BuildingProperties.getCellPositions(this.constructor.name).map((position) => {
            return new PIXI.Point(position.x + this.cellPosition.x, position.y + this.cellPosition.y);
        });
    };
}
