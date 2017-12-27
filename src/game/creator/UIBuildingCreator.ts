import {AbstractUICreator} from "./AbstractUICreator";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {BuildingPositioner} from "../interface/BuildingPositionner";
import {BuildingProperties} from "../building/BuildingProperties";

const X = 1202 - 66;

export class UIBuildingCreator extends AbstractUICreator {
    private buildingPositioner: BuildingPositioner;

    constructor(worldKnowledge: WorldKnowledge, player: Player, buildingPositionner: BuildingPositioner) {
        super(worldKnowledge, player, X);

        this.buildingPositioner = buildingPositionner;
    }

    getConstructableItems(): string[] {
        return BuildingProperties.getConstructableBuildings();
    }

    getSpriteKey(itemName: string): string {
        return BuildingProperties.getSpriteKey(itemName);
    }

    getSpriteLayer(itemName: string): number {
        return BuildingProperties.getSpriteLayer(itemName);
    }

    getConstructionTime(itemName: string): number {
        return BuildingProperties.getConstructionTime(itemName);
    }

    onProductFinish(itemName: string) {
        return this.setPendingButton(itemName);
    }

    onClickFunction(itemName: string) {
        if (this.player.order().getBuildingCreator().isProduced(itemName)) {
            this.buildingPositioner.activate(this.player.order().getBuildingCreator(), itemName);
        } else if (this.player.order().getBuildingCreator().isProducing(itemName)) {
            // Do nothing
        } else if (this.player.order().getBuildingCreator().isAllowed(itemName)) {
            this.player.order().productBuilding(itemName);
        }
    }
}
