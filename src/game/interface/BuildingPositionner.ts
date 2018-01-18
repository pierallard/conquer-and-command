import {SCALE} from "../game_state/Play";
import {Cell} from "../computing/Cell";
import {BuildingProperties} from "../building/BuildingProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {GROUND_SIZE} from "../map/Ground";
import {GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "./UserInterface";
import {Player} from "../player/Player";
import {Distance} from "../computing/Distance";
import {ConstructableBuilding} from "../building/ConstructableBuilding";

export const BUILDING_POSITIONNER_MIN_DIST = 6;

export class BuildingPositioner {
    public static isAccessible(cell: PIXI.Point, buildingName: string, worldKnowledge: WorldKnowledge, player: Player) {
        return this.isCellClose(cell, worldKnowledge, player) &&
            this.isCellAccessible(cell, worldKnowledge, buildingName);
    }

    private static isCellClose(cell: PIXI.Point, worldKnowledge: WorldKnowledge, player: Player) {
        const armies = worldKnowledge.getPlayerArmies(player);
        for (let i = 0; i < armies.length; i++) {
            const army = armies[i];
            if (army instanceof ConstructableBuilding) {
                const distance = Distance.to(cell, army.getCellPositions());
                if (distance < BUILDING_POSITIONNER_MIN_DIST) {
                    return true;
                }
            }
        }

        return false;
    }

    private static isCellAccessible(cell: PIXI.Point, worldKnowledge: WorldKnowledge, buildingName: string) {
        const cellPositions = BuildingProperties.getCellPositions(buildingName);
        for (let i = 0; i < cellPositions.length; i++) {
            const position = cellPositions[i];
            let newCell = new PIXI.Point(cell.x + position.x, cell.y + position.y);
            if (!worldKnowledge.isGroundCellAccessible(newCell)) {
                return false;
            }
        }

        return true;
    }

    private graphics: BuildingPositionerGraphics;
    private worldKnowledge: WorldKnowledge;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    create(game: Phaser.Game) {
        this.graphics = new BuildingPositionerGraphics(game, this.worldKnowledge, this.player);
    }

    activate(buildingName: string) {
        this.graphics.activate(buildingName);
    }
}

class BuildingPositionerGraphics extends Phaser.Graphics {
    private static isInBounds(x: number) {
        return x < GAME_WIDTH - INTERFACE_WIDTH;
    }

    private buildingName: string = null;
    private worldKnowledge: WorldKnowledge;
    private player: Player;

    constructor(game: Phaser.Game, worldKnowledge: WorldKnowledge, player: Player) {
        super(game, 0, 0);

        this.worldKnowledge = worldKnowledge;
        this.player = player;
        this.scale.set(SCALE, SCALE);
        game.add.existing(this);
    }

    activate(buildingName: string) {
        this.buildingName = buildingName;
    }

    deactivate() {
        this.buildingName = null;
    }

    update() {
        this.clear();
        if (null !== this.buildingName) {
            if (BuildingPositionerGraphics.isInBounds(this.game.input.mousePointer.x)) {
                let cellX = Cell.realToCell(this.game.input.mousePointer.x + this.game.camera.position.x);
                let cellY = Cell.realToCell(this.game.input.mousePointer.y + this.game.camera.position.y);

                const allowedToBuild = BuildingPositioner.isAccessible(
                    new PIXI.Point(cellX, cellY),
                    this.buildingName,
                    this.worldKnowledge,
                    this.player
                );
                if (allowedToBuild && this.game.input.activePointer.leftButton.isDown) {
                    this.worldKnowledge.runBuildingCreation(
                        this.player,
                        this.buildingName, new PIXI.Point(cellX, cellY)
                    );
                    this.deactivate();
                    return;
                }

                BuildingProperties.getCellPositions(this.buildingName).forEach((position) => {
                    let cellGapX = cellX + position.x;
                    let cellGapY = cellY + position.y;

                    let realCellGapX = Cell.cellToReal(cellGapX) / SCALE;
                    let realCellGapY = Cell.cellToReal(cellGapY) / SCALE;

                    this.lineStyle(1, allowedToBuild ? 0xffffff : 0xff0000, 0.8);
                    this.moveTo(realCellGapX - GROUND_SIZE / 2, realCellGapY - GROUND_SIZE / 4);
                    this.lineTo(realCellGapX - GROUND_SIZE / 4, realCellGapY - GROUND_SIZE / 2);

                    this.moveTo(realCellGapX - GROUND_SIZE / 2, realCellGapY);
                    this.lineTo(realCellGapX, realCellGapY - GROUND_SIZE / 2);

                    this.moveTo(realCellGapX - GROUND_SIZE / 2, realCellGapY + GROUND_SIZE / 4);
                    this.lineTo(realCellGapX + GROUND_SIZE / 4, realCellGapY - GROUND_SIZE / 2);

                    this.moveTo(realCellGapX - GROUND_SIZE / 2, realCellGapY + GROUND_SIZE / 2);
                    this.lineTo(realCellGapX + GROUND_SIZE / 2, realCellGapY - GROUND_SIZE / 2);

                    this.moveTo(realCellGapX - GROUND_SIZE / 4, realCellGapY + GROUND_SIZE / 2);
                    this.lineTo(realCellGapX + GROUND_SIZE / 2, realCellGapY - GROUND_SIZE / 4);

                    this.moveTo(realCellGapX, realCellGapY + GROUND_SIZE / 2);
                    this.lineTo(realCellGapX + GROUND_SIZE / 2, realCellGapY);

                    this.moveTo(realCellGapX + GROUND_SIZE / 4, realCellGapY + GROUND_SIZE / 2);
                    this.lineTo(realCellGapX + GROUND_SIZE / 2, realCellGapY + GROUND_SIZE / 4);
                });
            }
        }
    }
}
