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
import {Helipad} from "../building/Helipad";

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
                this.worldKnowledge.addArmy(powerPlant, true, 2);
                break;
            case 'AdvancedPowerPlant':
                let advancedPowerPlant = new AdvancedPowerPlant(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(advancedPowerPlant, true, 2);
                break;
            case 'Barracks':
                let barracks = new Barracks(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(barracks, true, 2);
                break;
            case 'TiberiumRefinery':
                let tiberiumRefinery = new TiberiumRefinery(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(tiberiumRefinery, true, 2);
                const cellHarvester = AlternativePosition.getClosestAvailable(
                    cell,
                    cell,
                    this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
                );
                let harvester = new Harvester(this.worldKnowledge, cellHarvester, this.player);
                this.worldKnowledge.addArmy(harvester, true);
                this.timerEvent.add(3 * Phaser.Timer.SECOND, () => {
                    harvester.harvest();
                });
                break;
            case 'ConcreteBarrier':
                let concreteBarrier = new ConcreteBarrier(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(concreteBarrier, false);
                break;
            case 'GuardTower':
                let guardTower = new GuardTower(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(guardTower, true, 2);
                break;
            case 'AdvancedGuardTower':
                let advancedGuardTower = new AdvancedGuardTower(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(advancedGuardTower, true, 2);
                break;
            case 'CommunicationCenter':
                let communicationCenter = new CommunicationCenter(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(communicationCenter, true, 2);
                break;
            case 'WeaponsFactory':
                let weaponsFactory = new WeaponsFactory(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(weaponsFactory, true, 2);
                break;
            case 'Helipad':
                let helipad = new Helipad(this.worldKnowledge, cell, this.player);
                this.worldKnowledge.addArmy(helipad, true, 2);
                break;
            default:
                throw "Unable to build building " + buildingName;
        }
    }
}
