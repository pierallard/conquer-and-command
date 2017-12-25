import {WorldKnowledge} from "../WorldKnowledge";

export abstract class Player {
    private color: number;
    private id: number;
    protected worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge, id: number, color: number) {
        this.worldKnowledge = worldKnowledge;
        this.id = id;
        this.color = color;
    }

    getColor(): number {
        return this.color;
    }

    getId(): number {
        return this.id;
    }
}
