import {BuildingProperties} from "../building/BuildingProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {PowerPlant} from "../building/PowerPlant";
import {Barracks} from "../building/Barracks";
import {AbstractCreator} from "./AbstractCreator";
import {TiberiumRefinery} from "../building/TiberiumRefinery";
import {Harvester} from "../unit/Harvester";
import {AlternativePosition} from "../computing/AlternativePosition";

export class BuildingCreator extends AbstractCreator {
    private producedBuildings: string[];
    private inProductionBuildings: string[];

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player);
        this.producedBuildings = [];
        this.inProductionBuildings = [];
    }

    getProducibles(): string[] {
        return BuildingProperties.getConstructableBuildings();
    }

    getRequiredBuildings(itemName: string): string[] {
        return BuildingProperties.getRequiredBuildings(itemName);
    }

    runProduction(buildingName: string) {
        this.inProductionBuildings.push(buildingName);
        this.timerEvent.add(BuildingProperties.getConstructionTime(buildingName) * Phaser.Timer.SECOND, () => {
            let index = this.inProductionBuildings.indexOf(buildingName);
            if (index > -1) {
                this.inProductionBuildings.splice(index, 1);
            }
            this.producedBuildings.push(buildingName);
        });

        if (this.uiCreator !== null) {
            this.uiCreator.runProduction(buildingName);
        }
    }

    isProduced(buildingName: string) {
        return this.producedBuildings.indexOf(buildingName) > -1;
    }

    isProducing(buildingName: string) {
        return this.inProductionBuildings.indexOf(buildingName) > -1;
    }

    runCreation(buildingName: string, cell: PIXI.Point) {
        switch (buildingName) {
            case 'PowerPlant':
                let powerPlant = new PowerPlant(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(powerPlant, true);
                break;
            case 'Barracks':
                let barracks = new Barracks(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(barracks, true);
                break;
            case 'TiberiumRefinery':
                let tiberiumRefinery = new TiberiumRefinery(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(tiberiumRefinery, true);
                const cellHarvester = AlternativePosition.getClosestAvailable(
                    cell,
                    cell,
                    this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
                );
                let harvester = new Harvester(this.worldKnowledge, cellHarvester, this.player);
                this.worldKnowledge.addUnit(harvester, true);
                break;
            default:
                throw "Unable to build building " + buildingName;
        }

        this.player.order().updateAllowedUnitsAndBuildings();
        if (this.uiCreator) {
            this.uiCreator.resetButton(buildingName);
        }

        let index = this.producedBuildings.indexOf(buildingName);
        if (index > -1) {
            this.producedBuildings.splice(index, 1);
        }
    }
}
