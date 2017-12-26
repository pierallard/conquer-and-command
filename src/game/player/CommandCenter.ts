import {WorldKnowledge} from "../WorldKnowledge";
import {Player} from "./Player";
import {MCV} from "../unit/MCV";
import {Unit} from "../unit/Unit";

export class CommandCenter {
    private worldKnowledge: WorldKnowledge;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
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

    createBuilding(buildingName: string, cell: PIXI.Point) {
        // I should see if there is a building acccessible for construction
    }

    askBuilding(buildingName) {
        // I should see if I CAN ask for this building
    }
}
