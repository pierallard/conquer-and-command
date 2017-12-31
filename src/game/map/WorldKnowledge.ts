import {BuildingRepository} from "../repository/BuildingRepository";
import {Player} from "../player/Player";
import {Building} from "../building/Building";
import {Unit} from "../unit/Unit";
import {UnitRepository} from "../repository/UnitRepository";
import {Appear} from "../sprite/Appear";
import {GeneratedGround} from "./GeneratedGround";
import {Shootable} from "../Shootable";
import {MiniAppear} from "../sprite/MiniAppear";
import {TiberiumPlant} from "../sprite/TiberiumPlant";

export class WorldKnowledge {
    private game: Phaser.Game;
    private ground: GeneratedGround;
    private groundGroup: Phaser.Group;
    private unitBuildingGroup: Phaser.Group;
    private unitRepository: UnitRepository;
    private buildingRepository: BuildingRepository;
    private groundRepository: TiberiumPlant[];

    constructor() {
        this.ground = new GeneratedGround();
        this.unitRepository = new UnitRepository();
        this.buildingRepository = new BuildingRepository();
        this.groundRepository = [];
    }

    create(game: Phaser.Game, startPositions: PIXI.Point[]) {
        this.game = game;
        this.ground.create(this.game, startPositions);

        this.groundGroup = this.game.add.group();
        this.groundGroup.fixedToCamera = false;

        this.unitBuildingGroup = this.game.add.group();
        this.unitBuildingGroup.fixedToCamera = false;
    }

    update() {
        this.unitBuildingGroup.sort('y');
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
        this.buildingRepository.getBuildings().forEach((building) => {
            building.update();
        });
    }

    isCellAccessible(position: PIXI.Point) {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position) &&
            this.buildingRepository.isCellNotOccupied(position);
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
            this.game.time.events.add(Phaser.Timer.SECOND * 1.5, () => {
                newBuilding.setVisible(true);
            }, this);
        }
    }

    addUnit(newUnit: Unit, appear: boolean = false) {
        this.unitRepository.add(newUnit);
        newUnit.create(this.game, this.unitBuildingGroup);
        if (appear) {
            newUnit.setVisible(false);
            let appearSprite = new MiniAppear(newUnit.getCellPositions()[0]);
            appearSprite.create(this.game, this.unitBuildingGroup);
            this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                newUnit.setVisible(true);
            }, this);
        }
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

    getGroundAt(cell: PIXI.Point): TiberiumPlant {
        for (let i = 0; i < this.groundRepository.length; i++) {
            if (this.groundRepository[i].getCellPositions()[0].x === cell.x &&
                this.groundRepository[i].getCellPositions()[0].y === cell.y) {
                return this.groundRepository[i];
            }
        }

        return null;
    }

    getUnits() {
        return this.unitRepository.getUnits();
    }

    getSelectedUnits() {
        return this.unitRepository.getSelectedUnits();
    }

    getPlayerBuildings(player: Player, type: string = null): Building[] {
        return this.buildingRepository.getBuildings(type).filter((building) => {
            return building.getPlayer() === player;
        });
    }

    getEnemyBuildings(player: Player, type: string = null): Building[] {
        return this.buildingRepository.getBuildings(type).filter((building) => {
            return building.getPlayer() !== null && building.getPlayer() !== player;
        });
    }

    getPlayerUnits(player: Player, type: string = null): Unit[] {
        return this.unitRepository.getUnits(type).filter((unit) => {
            return unit.getPlayer() === player;
        });
    }

    getEnemyUnits(player: Player, type: string = null): Unit[] {
        return this.unitRepository.getUnits(type).filter((unit) => {
            return unit.getPlayer() !== null && unit.getPlayer() !== player;
        });
    }

    getCreatorOf(buildingName: string, player: Player): Building {
        const creators = this.buildingRepository.getCreatorOf(buildingName).filter((building) => {
            return building.getPlayer() === player;
        });
        return creators.length > 0 ? creators[0] : null;
    }

    getEnemies(player: Player): (Shootable)[] {
        let result = [];
        this.getEnemyUnits(player).forEach((unit) => {
            result.push(unit);
        });
        this.getEnemyBuildings(player).forEach((building) => {
            result.push(building);
        });

        return result;
    }

    removeBuilding(building: Building) {
        this.buildingRepository.removeBuilding(building);
    }

    getGroundCSV() {
        return this.ground.getCSV();
    }

    addGroundElement(newPlant: TiberiumPlant) {
        this.groundGroup.add(newPlant);
        this.groundRepository.push(newPlant);
    }

    getGrounds(): TiberiumPlant[] {
        return this.groundRepository;
    }
}
