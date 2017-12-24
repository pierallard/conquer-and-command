import {WorldKnowledge} from "../WorldKnowledge";
import {Player} from "../player/Player";
import {UnitProperties} from "../unit/UnitProperties";
import {AbstractCreator} from "./AbstractCreator";
import {Harvester} from "../unit/Harvester";
import {Tank} from "../unit/Tank";
import {MCV} from "../unit/MCV";
import {AlternativePosition} from "../computing/AlternativePosition";

const X = 1202;

export class UnitCreator extends AbstractCreator {
    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super(worldKnowledge, player, X);
    }

    getConstructableItems(): string[] {
        return UnitProperties.getConstructableUnits();
    }

    getAllowedItems(name: string): string[] {
        return UnitProperties.getAllowedBuildings(name);
    }

    getSpriteKey(itemName: string): string {
        return UnitProperties.getSprite(itemName, this.player.getId());
    }

    getSpriteLayer(itemName: string): number {
        return UnitProperties.getSpriteLayer(itemName);
    }

    build(buildingName: string, cellPosition: PIXI.Point) {
        switch (buildingName) {
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
                throw "Unable to build unit " + buildingName;
        }

        this.resetButton(buildingName);
    }

    construct(unitName: string) {
        const building = this.worldKnowledge.getCreatorOf(unitName, this.player);
        this.build(unitName, AlternativePosition.getClosestAvailable(
            building.getCellPositions()[0],
            building.getCellPositions()[0],
            this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
        ));
    }
}
