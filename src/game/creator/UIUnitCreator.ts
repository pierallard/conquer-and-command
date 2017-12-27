import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {UnitProperties} from "../unit/UnitProperties";
import {AbstractUICreator} from "./AbstractUICreator";

const X = 1202;

export class UIUnitCreator extends AbstractUICreator {
    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player, X);
    }

    getConstructableItems(): string[] {
        return UnitProperties.getConstructableUnits();
    }

    getSpriteKey(itemName: string): string {
        return UnitProperties.getSprite(itemName, this.player.getId());
    }

    getSpriteLayer(itemName: string): number {
        return UnitProperties.getSpriteLayer(itemName);
    }

    getConstructionTime(itemName: string): number {
        return UnitProperties.getConstructionTime(itemName);
    }

    onProductFinish(itemName: string) {
        return this.resetButton(itemName);
    }

    onClickFunction(itemName: string) {
        if (this.player.order().getUnitCreator().isProducing(itemName)) {
            // Do nothing
        } else if (this.player.order().getUnitCreator().isAllowed(itemName)) {
            this.player.order().productUnit(itemName);
        }
    }
}
