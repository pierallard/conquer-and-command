import {Ground} from "./map/Ground";
import {UnitRepository} from "./repository/UnitRepository";
import {BuildingRepository} from "./repository/BuildingRepository";
import {Player} from "./player/Player";
import {Building} from "./building/Building";
import {Unit} from "./unit/Unit";

export class WorldKnowledge {
    private game: Phaser.Game;
    private ground: Ground;
    private unitBuildingGroup: Phaser.Group;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;

    constructor(game: Phaser.Game) {
        this.game = game;
        this.ground = new Ground();
        this.unitRepository = new UnitRepository();
        this.buildingRepository = new BuildingRepository();
    }

    create() {
        this.ground.create(this.game);

        this.unitBuildingGroup = this.game.add.group();
        this.unitBuildingGroup.fixedToCamera = false;
    }

    update() {
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
    }

    isCellAccessible(position: PIXI.Point) {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position) &&
            this.buildingRepository.isCellNotOccupied(position);
    }

    getEnemyUnits(player: Player) {
        return this.unitRepository.getEnemyUnits(player);
    }

    getPlayerBases() {
        return this.buildingRepository.getBuildings().filter((building) => {
            return building.constructor.name === 'Base';
        });
    }

    getUnitRepository() {
        return this.unitRepository;
    }

    getBuildingRepository(): BuildingRepository {
        return this.buildingRepository;
    }

    // TODO Deop these methods
    getGroundWidth() {
        return this.ground.getGroundWidth();
    }

    getGroundHeight() {
        return this.ground.getGroundHeight();
    }

    addBuilding(newBuilding: Building) {
        this.buildingRepository.add(newBuilding);
        newBuilding.create(this.game, this.unitBuildingGroup);
    }

    getCreatorOf(unit: string) {
        return this.buildingRepository.getCreatorOf(unit);
    }

    addUnit(newUnit: Unit) {
        this.unitRepository.add(newUnit);
        newUnit.create(this.game, this.unitBuildingGroup);
    }

    removeUnit(unit: Unit) {
        this.unitRepository.removeUnit(unit);
    }

    getUnitAt(cell: PIXI.Point) {
        return this.unitRepository.unitAt(cell);
    }

    getBuildingAt(cell: PIXI.Point) {
        return this.buildingRepository.buildingAt(cell);
    }

    getUnits() {
        return this.unitRepository.getUnits();
    }
}
