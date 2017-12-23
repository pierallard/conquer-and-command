import {SCALE} from "./game_state/Play";
import {Cell} from "./Cell";
import {GROUND_SIZE} from "./map/Ground";
import {UnitRepository} from "./repository/UnitRepository";
import {BuildingRepository} from "./repository/BuildingRepository";
import {BuildingCreator} from "./BuildingCreator";

export class BuildingPositionner extends Phaser.Graphics {
    private positions: PIXI.Point[];
    private unitRpository: UnitRepository;
    private buildingRepository: BuildingRepository;
    private buildingName: string;
    private buildingCreator: BuildingCreator;

    constructor(
        buildingCreateor: BuildingCreator,
        game: Phaser.Game,
        positions: PIXI.Point[],
        unitRepository: UnitRepository,
        buildingRepository: BuildingRepository,
        buildingName: string
    ) {
        super(game);

        this.buildingCreator = buildingCreateor;
        this.buildingName = buildingName;
        this.unitRpository = unitRepository;
        this.buildingRepository = buildingRepository;
        this.positions = positions;
        game.add.existing(this);
        this.scale.set(SCALE, SCALE);
    }

    update() {
        this.clear();
        let cellX = Cell.realToCell(this.game.input.mousePointer.x + this.game.camera.position.x);
        let cellY = Cell.realToCell(this.game.input.mousePointer.y + this.game.camera.position.y);

        let posable = true;
        this.positions.forEach((position) => {
            let cell = new PIXI.Point(cellX + position.x, cellY + position.y);
            if (!this.buildingRepository.isCellNotOccupied(cell) || !this.unitRpository.isCellNotOccupied(cell)) {
                posable = false;
            }
        });

        if (posable && this.game.input.activePointer.leftButton.isDown) {
            this.buildingCreator.build(this.buildingName, cellX, cellY);
            this.destroy();
        }

        this.positions.forEach((position) => {
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
