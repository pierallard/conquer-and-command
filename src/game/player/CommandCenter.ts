import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {Unit} from "../unit/Unit";
import {UnitCreator} from "../creator/UnitCreator";
import {BuildingCreator} from "../creator/BuildingCreator";
import {BuildingProperties} from "../building/BuildingProperties";
import {UnitProperties} from "../unit/UnitProperties";

export class CommandCenter {
    private worldKnowledge: WorldKnowledge;
    private player: Player;
    private unitCreator: UnitCreator;
    private buildingCreator: BuildingCreator;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
        this.unitCreator = new UnitCreator(this.worldKnowledge, this.player);
        this.buildingCreator = new BuildingCreator(this.worldKnowledge, this.player);
    }

    expand(mcv: MCV) {
        if (mcv.getPlayer() === this.player) {
            mcv.orderExpand();
        }
    }

    orderMoveAttack(unit: Unit, goal: PIXI.Point) {
        if (unit.getPlayer() === this.player) {
            unit.orderMoveAttack(goal);
        }
    }

    productBuilding(buildingName: string) {
        if (this.buildingCreator.isAllowed(buildingName) &&
            !this.buildingCreator.isProducing(buildingName) &&
            this.buildingCreator.hasMineralsToProduct(buildingName)
        ) {
            this.buildingCreator.runProduction(buildingName);
        }
    }

    createBuilding(buildingName: string, cell: PIXI.Point) {
        if (this.buildingCreator.isProduced(buildingName)) {
            this.buildingCreator.runCreation(buildingName, cell);
        }
    }

    productUnit(unitName: string) {
        if (this.unitCreator.isAllowed(unitName) &&
            !this.unitCreator.isProducing(unitName) &&
            this.unitCreator.hasMineralsToProduct(unitName)
        ) {
            this.player.removeMinerals(UnitProperties.getPrice(unitName));
            this.unitCreator.runProduction(unitName);
        }
    }
}
