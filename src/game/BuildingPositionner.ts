import {SCALE} from "./game_state/Play";
import {Cell} from "./Cell";
import {BuildingCreator} from "./BuildingCreator";
import {BuildingProperties} from "./building/BuildingProperties";
import {WorldKnowledge} from "./WorldKnowledge";
import {GROUND_SIZE} from "./map/Ground";

export class BuildingPositionner {
    private graphics: BuildingPositionnerGraphics;
    private worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game) {
        this.graphics = new BuildingPositionnerGraphics(game, this.worldKnowledge);
    }

    activate(buildingCreator: BuildingCreator, buildingName: string) {
        this.graphics.activate(buildingCreator, buildingName);
    }
}

class BuildingPositionnerGraphics extends Phaser.Graphics {
    private buildingCreator: BuildingCreator;
    private buildingName: string = null;
    private worldKnowledge: WorldKnowledge;

    constructor(game: Phaser.Game, worldKnowledge: WorldKnowledge) {
        super(game, 0, 0);

        this.worldKnowledge = worldKnowledge;

        this.scale.set(SCALE, SCALE);
        game.add.existing(this);
    }

    activate(buildingCreator: BuildingCreator, buildingName: string) {
        this.buildingCreator = buildingCreator;
        this.buildingName = buildingName;
    }

    deactivate() {
        this.buildingName = null;
    }

    update() {
        this.clear();
        if (null !== this.buildingName) {
            let cellX = Cell.realToCell(this.game.input.mousePointer.x + this.game.camera.position.x);
            let cellY = Cell.realToCell(this.game.input.mousePointer.y + this.game.camera.position.y);

            let posable = true;
            BuildingProperties.getCellPositions(this.buildingName).forEach((position) => {
                let cell = new PIXI.Point(cellX + position.x, cellY + position.y);
                if (!this.worldKnowledge.isCellAccessible(cell)) {
                    posable = false;
                }
            });

            if (posable && this.game.input.activePointer.leftButton.isDown) {
                this.buildingCreator.build(this.buildingName, new PIXI.Point(cellX, cellY));
                this.deactivate();
                return;
            }

            BuildingProperties.getCellPositions(this.buildingName).forEach((position) => {
                let cellGapX = cellX + position.x;
                let cellGapY = cellY + position.y;

                let realCellGapX = Cell.cellToReal(cellGapX) / SCALE;
                let realCellGapY = Cell.cellToReal(cellGapY) / SCALE;

                this.lineStyle(1, posable ? 0xffffff : 0xff0000, 0.8);
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
