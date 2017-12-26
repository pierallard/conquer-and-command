import {WorldKnowledge} from "../map/WorldKnowledge";
import {CommandCenter} from "./CommandCenter";
import {BuildingCreator} from "../creator/BuildingCreator";
import {UnitCreator} from "../creator/UnitCreator";

export abstract class Player {
    protected worldKnowledge: WorldKnowledge;
    private color: number;
    private id: number;
    private commandCenter: CommandCenter;

    constructor(worldKnowledge: WorldKnowledge, id: number, color: number) {
        this.worldKnowledge = worldKnowledge;
        this.id = id;
        this.color = color;
        this.commandCenter = new CommandCenter(this.worldKnowledge, this);
    }

    getColor(): number {
        return this.color;
    }

    getId(): number {
        return this.id;
    }

    order() {
        return this.commandCenter;
    }

    getBuildingCreator(): BuildingCreator {
        return this.commandCenter.getBuildingCreator();
    }

    getUnitCreator(): UnitCreator {
        return this.commandCenter.getUnitCreator();
    }

    updateAllowedUnitsAndBuildings() {
        this.commandCenter.updateAllowedUnitsAndBuildings();
    }
}
