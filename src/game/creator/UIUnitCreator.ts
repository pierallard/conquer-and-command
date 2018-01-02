import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {UnitProperties} from "../unit/UnitProperties";
import {AbstractUICreator} from "./AbstractUICreator";

const X = 1202;

export class UIUnitCreator extends AbstractUICreator {
    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player, X);
    }

    update() {
        super.update();

        const productionStatus = this.worldKnowledge.getUnitProductionStatus(this.player);
        this.buttons.forEach((button) => {
            if (productionStatus && button.getName() === productionStatus.getItemName()) {
                button.updateProgress(productionStatus.percentage);
            } else {
                button.setAvailable(this.worldKnowledge.canProductUnit(this.player, button.getName()));
                button.updateProgress(0);
            }
        });
    }

    getPossibleButtons(): string[] {
        return this.worldKnowledge.getPlayerAllowedUnits(this.player);
    }

    getSpriteKey(itemName: string): string {
        return UnitProperties.getSprite(itemName, this.player.getId());
    }

    getSpriteLayer(itemName: string): number {
        return UnitProperties.getSpriteLayer(itemName);
    }

    onClickFunction(itemName: string) {
        this.worldKnowledge.productUnit(this.player, itemName);
    }
}
