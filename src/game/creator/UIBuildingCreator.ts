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

    update() {
        super.update();

        const productionStatus = this.worldKnowledge.getBuildingProductionStatus(this.player);
        this.buttons.forEach((button) => {
            if (productionStatus && button.getName() === productionStatus.getItemName()) {
                button.updateProgress(productionStatus.percentage);
            } else {
                button.setAvailable(this.worldKnowledge.canProductBuilding(this.player, button.getName()));
                button.updateProgress(0);
            }
        });
    }

    getPossibleButtons(): string[] {
        return this.worldKnowledge.getPlayerAllowedBuildings(this.player);
    }

    getSpriteKey(itemName: string): string {
        return BuildingProperties.getSpriteKey(itemName);
    }

    getSpriteLayer(itemName: string): number {
        return BuildingProperties.getSpriteLayer(itemName);
    }

    onClickFunction(itemName: string) {
        if (this.worldKnowledge.isBuildingProduced(this.player, itemName)) {
            this.buildingPositioner.activate(itemName);
        } else {
            this.worldKnowledge.productBuilding(this.player, itemName);
        }
    }
}
