import {Building} from "./Building";
import {Player} from "../player/Player";
import {BuildingProperties} from "./BuildingProperties";

export abstract class ConstructableBuilding extends Phaser.Sprite implements Building {
    protected player: Player;
    protected cellPosition: PIXI.Point;

    getCellPositions(): PIXI.Point[] {
        return BuildingProperties.getCellPositions(this.constructor.name).map((position) => {
            return new PIXI.Point(position.x + this.cellPosition.x, position.y + this.cellPosition.y);
        });
    };

    build(unitName: string): void {
        let f = eval(`this.build${unitName}`).bind(this);
        let unit = f();
        this.player.getUnitRepository().add(unit);
    }
}
