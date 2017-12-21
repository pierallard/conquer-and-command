import {Building} from "./Building";
import {Player} from "../player/Player";

export abstract class BaseBuilding extends Phaser.Sprite implements Building {
    protected player: Player;

    abstract getCellPositions();

    getBuildMethods(): Object {
        return {}
    }

    build(unitName: string): void {
        let f = this.getBuildMethods()[unitName].bind(this);
        let unit = f();
        this.player.getUnitRepository().add(unit);
    }
}
