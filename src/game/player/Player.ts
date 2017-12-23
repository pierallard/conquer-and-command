import {Ground} from "../map/Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {Unit} from "../unit/Unit";
import {BuildingRepository} from "../repository/BuildingRepository";
import {Base} from "../building/Base";

export class Player {
    private ground: Ground;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;
    private color: number;
    private id: number;

    constructor(
        id: number,
        ground: Ground,
        unitRepository: UnitRepository,
        buildingRepository: BuildingRepository,
        color: number
    ) {
        this.id = id;
        this.ground = ground;
        this.unitRepository = unitRepository;
        this.buildingRepository = buildingRepository;
        this.color = color;
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

    /**
     * @deprecated
     */
    getBuildingRepository(): BuildingRepository {
        return this.buildingRepository;
    }

    getBases() {
        return this.buildingRepository.getBuildings().filter((building) => {
            return building instanceof Base;
        });
    }

    getColor(): number {
        return this.color;
    }

    getId(): number {
        return this.id;
    }
}
