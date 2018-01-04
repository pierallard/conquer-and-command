import {AbstractUICreator} from "./AbstractUICreator";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {BuildingPositioner} from "../interface/BuildingPositionner";
import {BuildingProperties} from "../building/BuildingProperties";
import {ProductionStatus} from "./AbstractCreator";

const X = 1202 - 66;

export class UIBuildingCreator extends AbstractUICreator {
    private buildingPositioner: BuildingPositioner;

    constructor(worldKnowledge: WorldKnowledge, player: Player, buildingPositionner: BuildingPositioner) {
        super(worldKnowledge, player, X);

        this.buildingPositioner = buildingPositionner;
    }

    protected getPossibleButtons(): string[] {
        return this.worldKnowledge.getPlayerAllowedBuildings(this.player);
    }

    protected getSpriteKey(itemName: string): string {
        return BuildingProperties.getSpriteKey(itemName);
    }

    protected getSpriteLayer(itemName: string): number {
        return BuildingProperties.getSpriteLayer(itemName);
    }

    protected onClickFunction(itemName: string) {
        if (this.worldKnowledge.isBuildingProduced(this.player, itemName)) {
            this.buildingPositioner.activate(itemName);
        } else {
            this.worldKnowledge.productBuilding(this.player, itemName);
        }
    }

    protected onRightClickFunction(itemName: string) {
        if (this.worldKnowledge.isBuildingProducing(this.player, itemName)) {
            this.worldKnowledge.holdBuilding(this.player, itemName);
        }
    }

    protected getProductionStatus(): ProductionStatus {
        return this.worldKnowledge.getBuildingProductionStatus(this.player);
    }

    protected canProduct(itemName: string): boolean {
        return this.worldKnowledge.canProductBuilding(this.player, itemName);
    }
}
