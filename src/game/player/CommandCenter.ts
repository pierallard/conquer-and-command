import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {Unit} from "../unit/Unit";
import {UnitCreator} from "../creator/UnitCreator";
import {BuildingCreator} from "../creator/BuildingCreator";

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

    getUnitCreator() {
        return this.unitCreator;
    }

    getBuildingCreator() {
        return this.buildingCreator;
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
        this.buildingCreator.orderProduction(buildingName);
    }

    productUnit(unitName: string) {
        this.unitCreator.orderProduction(unitName);
    }

    createBuilding(buildingName: string, cell: PIXI.Point) {
        if (this.buildingCreator.isProduced(buildingName)) {
            this.buildingCreator.runCreation(buildingName, cell);
        }
    }
}
