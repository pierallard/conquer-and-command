import {BuildingProperties} from "../building/BuildingProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {PowerPlant} from "../building/PowerPlant";
import {Barracks} from "../building/Barracks";
import {AbstractCreator, ProductionStatus} from "./AbstractCreator";
import {TiberiumRefinery} from "../building/TiberiumRefinery";
import {Harvester} from "../unit/Harvester";
import {AlternativePosition} from "../computing/AlternativePosition";
import {ConcreteBarrier} from "../building/ConcreteBarrier";
import {AdvancedPowerPlant} from "../building/AdvancedPowerPlant";
import {GuardTower} from "../building/GuardTower";
import {WeaponsFactory} from "../building/WeaponsFactory";
import {AdvancedGuardTower} from "../building/AdvancedGuardTower";
import {CommunicationCenter} from "../building/CommunicationCenter";

export class BuildingCreator extends AbstractCreator {
    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player);
    }

    getAllowedBuildings(): string[] {
        return BuildingProperties.getConstructableBuildings().filter((buildingName) => {
            return this.isAllowed(buildingName);
        });
    }

    getRequiredBuildings(itemName: string): string[] {
        return BuildingProperties.getRequiredBuildings(itemName);
    }

    canProduct(itemName: string): boolean {
        return !this.isProducingAny() && this.isAllowed(itemName);
    }

    runProduction(buildingName: string) {
        this.productionStatus = new ProductionStatus(
            buildingName,
            BuildingProperties.getConstructionTime(buildingName) * Phaser.Timer.SECOND,
            BuildingProperties.getPrice(buildingName),
            this.player,
            () => {},
            this.game
        );
    }

    runCreation(buildingName: string, cell: PIXI.Point) {
        this.productionStatus = null;

        switch (buildingName) {
            case 'PowerPlant':
                let powerPlant = new PowerPlant(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(powerPlant, true);
                break;
            case 'AdvancedPowerPlant':
                let advancedPowerPlant = new AdvancedPowerPlant(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(advancedPowerPlant, true);
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
                this.timerEvent.add(3 * Phaser.Timer.SECOND, () => {
                    harvester.harvest();
                });
                break;
            case 'ConcreteBarrier':
                let concreteBarrier = new ConcreteBarrier(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(concreteBarrier, false);
                break;
            case 'GuardTower':
                let guardTower = new GuardTower(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(guardTower, true);
                break;
            case 'AdvancedGuardTower':
                let advancedGuardTower = new AdvancedGuardTower(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(advancedGuardTower, true);
                break;
            case 'CommunicationCenter':
                let communicationCenter = new CommunicationCenter(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(communicationCenter, true);
                break;
            case 'WeaponsFactory':
                let weaponsFactory = new WeaponsFactory(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addBuilding(weaponsFactory, true);
                break;
            default:
                throw "Unable to build building " + buildingName;
        }
    }
}
