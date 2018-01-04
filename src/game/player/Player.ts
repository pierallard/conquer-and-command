import {WorldKnowledge} from "../map/WorldKnowledge";
import {CommandCenter} from "./CommandCenter";

const START_MINERALS = 10000;
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

    order(): CommandCenter {
        return this.commandCenter;
    }

    addMinerals(amount: number) {
        this.minerals = this.minerals + amount;
    }

    removeMinerals(amount: number) {
        this.minerals = this.minerals - amount;
    }

    getMinerals(): number {
        return this.minerals;
    }

    getUnitCreator() {
        return this.commandCenter.getUnitCreator();
    }

    getBuildingCreator() {
        return this.commandCenter.getBuildingCreator();
    }
}
