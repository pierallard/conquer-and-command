import {Ground} from "./map/Ground";
import {BuildingRepository} from "./repository/BuildingRepository";
import {Player} from "./player/Player";
import {Building} from "./building/Building";
import {Unit} from "./unit/Unit";
import {UnitRepository} from "./repository/UnitRepository";
import {Appear} from "./sprite/Appear";
import {BuildingCreator} from "./BuildingCreator";

export class WorldKnowledge {
    private game: Phaser.Game;
    private ground: Ground;
    private unitBuildingGroup: Phaser.Group;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;
    private buildingCreator: BuildingCreator;

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

    getPlayerConstructionYards() {
        return this.buildingRepository.getBuildings().filter((building) => {
            return building.constructor.name === 'ConstructionYard';
        });
    }

    getGroundWidth() {
        return this.ground.getGroundWidth();
    }

    getGroundHeight() {
        return this.ground.getGroundHeight();
    }

    addBuilding(newBuilding: Building, appear: boolean = false) {
        this.buildingRepository.add(newBuilding);
        newBuilding.create(this.game, this.unitBuildingGroup);
        if (appear) {
            newBuilding.setVisible(false);
            let appearSprite = new Appear(newBuilding.getCellPositions()[0]);
            appearSprite.create(this.game, this.unitBuildingGroup);
            this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                newBuilding.setVisible(true);
            }, this);
        }
        this.buildingCreator.update();
    }

    getCreatorOf(unit: string) {
        return this.buildingRepository.getCreatorOf(unit);
    }

    addUnit(newUnit: Unit) {
        this.unitRepository.add(newUnit);
        newUnit.create(this.game, this.unitBuildingGroup);
    }

    removeUnit(unit: Unit, delay: number = 0) {
        if (delay === 0) {
            this.unitRepository.removeUnit(unit);
        } else {
            this.game.time.events.add(delay, () => {
                this.unitRepository.removeUnit(unit);
            });
        }
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

    setBuildingCreator(buildingCreator: BuildingCreator) {
        this.buildingCreator = buildingCreator;
    }

    getBuildings(): Building[] {
        return this.buildingRepository.getBuildings();
    }
}
