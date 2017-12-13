import {MovedSprite} from "./MovedSprite";
import {Ground} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {Cell} from "../Cell";
import {AStar} from "../AStar";
import {AlternativePosition} from "../AlternativePosition";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const MAKE_ANIM = true;

enum Mode {
    STAND,
    MOVETO,
    ATTACK,
    FOLLOW
}

export class AStarSprite extends MovedSprite
{
    private cellGoal: PIXI.Point = null;
    private unitGoal: AStarSprite = null;
    private cellPosition: PIXI.Point;
    private ground: Ground;
    private canMove: boolean = true;
    private state: Mode;

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
        this.state = Mode.STAND;
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    isArrived(): boolean
    {
        let goal = null;
        if (this.cellGoal) {
            goal = this.cellGoal;
        } else if (this.unitGoal) {
            goal = this.unitGoal.getCellPosition();
        }

        if (null === goal) {
            return true;
        }

        return AlternativePosition.isArrived(goal, this.cellPosition, this.isPositionAccessible.bind(this));
    }

    isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position);
    };

    update()
    {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.updateState();
        }

        if (this.isArrived()) {
            if (this.state === Mode.MOVETO) {
                this.cellGoal = null;
                this.state = Mode.STAND;
            }
        }

        let nextStep = null;
        if (this.canMove) {
            if (this.cellGoal) {
                nextStep = AStar.nextStep(this.cellPosition, this.cellGoal, this.isPositionAccessible.bind(this));
            } else if (this.unitGoal && !this.isArrived()) {
                nextStep = AStar.nextStep(this.cellPosition, this.unitGoal.getCellPosition(), this.isPositionAccessible.bind(this));
            }

            if (nextStep) {
                this.loadRotation(this.getRotation(new PIXI.Point(
                    nextStep.x - this.cellPosition.x,
                    nextStep.y - this.cellPosition.y
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

                this.canMove = false;
                this.unitRepository.play_.game.time.events.add(MOVE_TIME, () => {
                    this.canMove = true;
                }, this);
            }
        }

        super.update();
    }

    private updateState() {
        const cell = new PIXI.Point(
            Cell.realToCell(this.game.input.mousePointer.x),
            Cell.realToCell(this.game.input.mousePointer.y)
        );
        const unit = this.unitRepository.unitAt(cell);
        if (null !== unit) {
            this.state = Mode.FOLLOW;
            this.unitGoal = unit;
            this.cellGoal = null;
        } else {
            this.state = Mode.MOVETO;
            this.cellGoal = cell;
            this.unitGoal = null;
        }
        if (this.isArrived()) {
            this.state = Mode.STAND;
            this.cellGoal = null;
        }
    }
}
