import {Unit} from "../unit/Unit";
import {WorldKnowledge} from "../WorldKnowledge";

export class Player {
    private worldKnowledge: WorldKnowledge;
    private color: number;
    private id: number;

    constructor(worldKnowledge: WorldKnowledge, id: number, color: number) {
        this.worldKnowledge = worldKnowledge;
        this.id = id;
        this.color = color;
    }

    // TODO Remove this method
    public isPositionAccessible(position: PIXI.Point): boolean {
        return this.worldKnowledge.isCellAccessible(position);
    };

    getEnemyUnits(): Unit[] {
        return this.worldKnowledge.getEnemyUnits(this);
    }

    // TODO No player needed ?
    getBases() {
        return this.worldKnowledge.getPlayerBases();
    }

    getColor(): number {
        return this.color;
    }

    getId(): number {
        return this.id;
    }
}
