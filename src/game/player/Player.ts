import {WorldKnowledge} from "../map/WorldKnowledge";
import {CommandCenter} from "./CommandCenter";
import {BuildingCreator} from "../creator/BuildingCreator";
import {UnitCreator} from "../creator/UnitCreator";

const START_MINERALS = 3000;
export const START_POWER = 10;

export abstract class Player {
    protected worldKnowledge: WorldKnowledge;
    private color: number;
    private id: number;
    private commandCenter: CommandCenter;
    private minerals: number = START_MINERALS;

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

    addMinerals(amount: number) {
        this.minerals = Math.round(this.minerals + amount);
        this.commandCenter.updateBuyableUnitsAndbuilding();
    }

    removeMinerals(amount: number) {
        this.minerals = Math.round(this.minerals - amount);
        this.commandCenter.updateBuyableUnitsAndbuilding();
    }

    getMinerals(): number {
        return this.minerals;
    }
}
