import {Ground} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";

export class Player {
    private tankKey: string;
    private ground: Ground;
    private unitRepository: UnitRepository;

    constructor(ground: Ground, unitRepository: UnitRepository, tankKey: string) {
        this.tankKey = tankKey;
        this.ground = ground;
        this.unitRepository = unitRepository;
    }

    getTankKey(): string {
        return this.tankKey;
    }

    public isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) && this.unitRepository.isCellNotOccupied(position);
    };
}
