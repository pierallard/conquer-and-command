import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {UnitProperties} from "../unit/UnitProperties";
import {AbstractUICreator} from "./AbstractUICreator";
import {ProductionStatus} from "./AbstractCreator";

const X = 1202;

export class UIUnitCreator extends AbstractUICreator {
    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player, X);
    }

    protected getPossibleButtons(): string[] {
        return this.worldKnowledge.getPlayerAllowedUnits(this.player);
    }

    protected getSpriteKey(itemName: string): string {
        return UnitProperties.getSprite(itemName, this.player.getId());
    }

    protected getSpriteLayer(itemName: string): number {
        return UnitProperties.getSpriteLayer(itemName);
    }

    protected onClickFunction(itemName: string) {
        this.worldKnowledge.productUnit(this.player, itemName);
    }

    protected getProductionStatus(): ProductionStatus {
        return this.worldKnowledge.getUnitProductionStatus(this.player);
    }

    protected canProduct(itemName: string): boolean {
        return this.worldKnowledge.canProductUnit(this.player, itemName);
    }

    protected onRightClickFunction(itemName: string) {
        if (this.worldKnowledge.isUnitProducing(this.player, itemName)) {
            if (this.worldKnowledge.isUnitHold(this.player, itemName)) {
                this.worldKnowledge.cancelUnit(this.player, itemName);
            } else {
                this.worldKnowledge.holdUnit(this.player, itemName);
            }
        }
    }
}
