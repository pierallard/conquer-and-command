import {MovedSprite} from "./MovedSprite";
import {Ground} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {Cell} from "../Cell";
import {AStar} from "../AStar";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const MAKE_ANIM = true;

export class AStarSprite extends MovedSprite
{
    private cellGoal: PIXI.Point = null;
    private cellPosition: PIXI.Point;
    private ground: Ground;
    private canMove: boolean = true;

    constructor(unitRepository: UnitRepository, x: number, y: number, ground: Ground) {
        super(
            unitRepository,
            Cell.cellToReal(Cell.realToCell(x)),
            Cell.cellToReal(Cell.realToCell(y)),
            'Tank11',
            1000
        );

        this.cellPosition = new PIXI.Point(Cell.realToCell(x), Cell.realToCell(y));
        this.ground = ground;
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    isArrived(): boolean
    {
        if (!this.cellGoal) {
            return true;
        }

        let radius = 0;
        while(radius < 20) {
            let foundEmptyPlace = false;
            let foundThis = false;
            for (let i = -radius; i <= radius; i++) {
                for (let j = -radius; j <= radius; j++) {
                    if (this.isPositionAccessible(new PIXI.Point(this.cellGoal.x + i, this.cellGoal.y + j))) {
                        foundEmptyPlace = true;
                    }
                    if (this.cellGoal.x + i === this.cellPosition.x && this.cellGoal.y + j === this.cellPosition.y) {
                        foundThis = true;
                    }
                }
            }

            if (foundThis) {
                return true;
            }
            if (foundEmptyPlace && !foundThis) {
                return false;
            }

            radius++;
        }

        return true;
    }

    isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position);
    };

    update()
    {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.cellGoal = new PIXI.Point(
                Cell.realToCell(this.game.input.mousePointer.x),
                Cell.realToCell(this.game.input.mousePointer.y)
            );
            if (this.isArrived()) {
                this.cellGoal = null;
            }
        }

        if (this.cellGoal && this.canMove) {
            const nextStep = AStar.nextStep(this.cellPosition, this.cellGoal, this.isPositionAccessible.bind(this));

            if (nextStep) {
                this.loadRotation(this.getRotation(new PIXI.Point(
                    Cell.cellToReal(nextStep.x) - this.x,
                    Cell.cellToReal(nextStep.y) - this.y
                )));

                this.cellPosition = nextStep;

                if (MAKE_ANIM) {
                    this.unitRepository.play_.game.add.tween(this).to({
                        x: Cell.cellToReal(this.cellPosition.x),
                        y: Cell.cellToReal(this.cellPosition.y)
                    }, MOVE_TIME, Phaser.Easing.Default, true);
                } else {
                    this.x = Cell.cellToReal(this.cellPosition.x);
                    this.y = Cell.cellToReal(this.cellPosition.y);
                }

                if (this.isArrived()) {
                    this.cellGoal = null;
                }

                this.canMove = false;
                this.unitRepository.play_.game.time.events.add(MOVE_TIME, () => {
                    this.canMove = true;
                }, this);
            }
        }

        super.update();
    }



}
