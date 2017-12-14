import {Ground} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {AStarSprite} from "../sprite/AStarSprite";
import {BuildingRepository} from "../repository/BuildingRepository";

export class Player {
    private tankKey: string;
    private ground: Ground;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;

    constructor(
        ground: Ground,
        unitRepository: UnitRepository,
        buildingRepository: BuildingRepository,
        tankKey: string
    ) {
        this.tankKey = tankKey;
        this.ground = ground;
        this.unitRepository = unitRepository;
        this.buildingRepository = buildingRepository;
    }

    getTankKey(): string {
        return this.tankKey;
    }

    public isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position) &&
            this.buildingRepository.isCellNotOccupied(position);
    };

    /**
     * @deprecated
     */
    getUnitRepository(): UnitRepository {
        return this.unitRepository;
    }

    getEnnemyUnits(): AStarSprite[] {
        return this.unitRepository.getEnnemyUnits(this);
    }
}
