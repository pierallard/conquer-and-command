import {AbstractUICreator} from "./AbstractUICreator";
import {WorldKnowledge} from "../WorldKnowledge";
import {Player} from "../player/Player";
import {BuildingPositionner} from "../BuildingPositionner";
import {BuildingProperties} from "../building/BuildingProperties";

const X = 1202 - 66;

export class UIBuildingCreator extends AbstractUICreator {
    private buildingPositionner: BuildingPositionner;

    constructor(worldKnowledge: WorldKnowledge, player: Player, buildingPositionner: BuildingPositionner) {
        super(worldKnowledge, player, X);

        this.buildingPositionner = buildingPositionner;
    }

    getConstructableItems(): string[] {
        return BuildingProperties.getConstructableBuildings();
    }

    getAllowedItems(name: string): string[] {
        return BuildingProperties.getRequiredBuildings(name);
    }

    getSpriteKey(itemName: string): string {
        return BuildingProperties.getSpriteKey(itemName);
    }

    getSpriteLayer(itemName: string): number {
        return BuildingProperties.getSpriteLayer(itemName);
    }

    getConstructionTime(itemName: string): number {
        return BuildingProperties.getConstructionTime(itemName)
    }

    onProductFinish(itemName: string) {
        return this.setPendingButton(itemName);
    }

    onClickFunction(itemName: string) {
        if (this.player.order().getBuildingCreator().isProduced(itemName)) {
            this.buildingPositionner.activate(this.player.order().getBuildingCreator(), itemName);
        } else if (this.player.order().getBuildingCreator().isProducing(itemName)) {
            // Do nothing
        } else if (this.player.order().getBuildingCreator().isAllowed(itemName)) {
            this.player.order().productBuilding(itemName);
        }
    }
}
