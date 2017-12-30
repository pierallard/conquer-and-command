import {AbstractCreator} from "./AbstractCreator";
import {UnitProperties} from "../unit/UnitProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {Harvester} from "../unit/Harvester";
import {Tank} from "../unit/Tank";
import {MCV} from "../unit/MCV";
import {AlternativePosition} from "../computing/AlternativePosition";

export class UnitCreator extends AbstractCreator {
    private inProductionUnits: string[];

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player);
        this.inProductionUnits = [];
    }

    getProducibles(): string[] {
        return UnitProperties.getConstructableUnits();
    }

    getRequiredBuildings(itemName: string): string[] {
        return UnitProperties.getRequiredBuildings(itemName);
    }

    isProducing(itemName: string): boolean {
        return this.inProductionUnits.indexOf(itemName) > -1;
    }

    hasMineralsToProduct(buildingName: string) {
        return this.player.getMinerals() >= UnitProperties.getPrice(buildingName);
    }

    runProduction(unitName: string) {
        this.inProductionUnits.push(unitName);
        this.timerEvent.add(UnitProperties.getConstructionTime(unitName) * Phaser.Timer.SECOND, () => {
            let index = this.inProductionUnits.indexOf(unitName);
            if (index > -1) {
                this.inProductionUnits.splice(index, 1);
            }

            if (this.uiCreator) {
                this.uiCreator.resetButton(unitName);
            }

            const building = this.worldKnowledge.getCreatorOf(unitName, this.player);
            if (null == building) {
                return;
            }

            const cellPosition = AlternativePosition.getClosestAvailable(
                building.getCellPositions()[0],
                building.getCellPositions()[0],
                this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
            );
            switch (unitName) {
                case 'Harvester':
                    let harvester = new Harvester(this.worldKnowledge, cellPosition, this.player);
                    this.worldKnowledge.addUnit(harvester);
                    break;
                case 'Tank':
                    let tank = new Tank(this.worldKnowledge, cellPosition, this.player);
                    this.worldKnowledge.addUnit(tank);
                    break;
                case 'MCV':
                    let mcv = new MCV(this.worldKnowledge, cellPosition, this.player);
                    this.worldKnowledge.addUnit(mcv);
                    break;
                default:
                    throw "Unable to build unit " + unitName;
            }
        });

        if (this.uiCreator !== null) {
            this.uiCreator.runProduction(unitName);
        }
    }
}
