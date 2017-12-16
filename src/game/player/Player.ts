import {Ground} from "../map/Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {Unit} from "../unit/Unit";
import {BuildingRepository} from "../repository/BuildingRepository";
import {Base} from "../building/Base";

export class Player {
    private tankKey: string;
    private ground: Ground;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;
    private color: number;

    constructor(
        ground: Ground,
        unitRepository: UnitRepository,
        buildingRepository: BuildingRepository,
        tankKey: string,
        color: number
    ) {
        this.tankKey = tankKey;
        this.ground = ground;
        this.unitRepository = unitRepository;
        this.buildingRepository = buildingRepository;
        this.color = color;
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

    getEnnemyUnits(): Unit[] {
        return this.unitRepository.getEnnemyUnits(this);
    }

    getHarversterKey() {
        return 'Builder2';
    }

    /**
     * @deprecated
     */
    getBuildingRepository(): BuildingRepository {
        return this.buildingRepository;
    }

    getBases() {
        return this.buildingRepository.getBuildings().filter((building) => {
            return building instanceof Base;
        })
    }

    getColor(): number {
        return this.color;
    }
}
