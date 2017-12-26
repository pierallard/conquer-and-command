import {AbstractUICreator} from "./AbstractUICreator";
import {WorldKnowledge} from "../WorldKnowledge";
import {Player} from "../player/Player";
import {BuildingPositionner} from "../BuildingPositionner";
import {BuildingProperties} from "../building/BuildingProperties";
import {PowerPlant} from "../building/PowerPlant";
import {Barracks} from "../building/Barracks";

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
        return BuildingProperties.getAllowedBuildings(name);
    }

    getSpriteKey(itemName: string): string {
        return BuildingProperties.getSpriteKey(itemName);
    }

    getSpriteLayer(itemName: string): number {
        return BuildingProperties.getSpriteLayer(itemName);
    }

    build(buildingName: string, cellPosition: PIXI.Point) {
        switch (buildingName) {
            case 'PowerPlant':
                let powerPlant = new PowerPlant(this.worldKnowledge, cellPosition, this.player);
                this.worldKnowledge.addBuilding(powerPlant, true);
                break;
            case 'Barracks':
                let barracks = new Barracks(this.worldKnowledge, cellPosition, this.player);
                this.worldKnowledge.addBuilding(barracks, true);
                break;
            default:
                throw "Unable to build building " + buildingName;
        }

        this.resetButton(buildingName);
    }

    construct(buildingName: string) {
        this.buildingPositionner.activate(this, buildingName);
    }
}
