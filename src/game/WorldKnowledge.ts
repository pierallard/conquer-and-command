import {Ground} from "./map/Ground";
import {BuildingRepository} from "./repository/BuildingRepository";
import {Player} from "./player/Player";
import {Building} from "./building/Building";
import {Unit} from "./unit/Unit";
import {UnitRepository} from "./repository/UnitRepository";

export class WorldKnowledge {
    private game: Phaser.Game;
    private ground: Ground;
    private unitBuildingGroup: Phaser.Group;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;

    constructor() {
        this.ground = new Ground();
        this.unitRepository = new UnitRepository();
        this.buildingRepository = new BuildingRepository();
    }

    create(game: Phaser.Game) {
        this.game = game;
        this.ground.create(this.game);

        this.unitBuildingGroup = this.game.add.group();
        this.unitBuildingGroup.fixedToCamera = false;
    }

    update() {
        this.unitBuildingGroup.sort('y');
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

    getSelectedUnits() {
        return this.unitRepository.getSelectedUnits();
    }
}
