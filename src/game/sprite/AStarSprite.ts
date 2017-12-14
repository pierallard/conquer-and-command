import {MovedSprite} from "./MovedSprite";
import {Ground} from "../Ground";
import {UnitRepository} from "../repository/UnitRepository";
import {Cell} from "../Cell";
import {AStar} from "../AStar";
import {AlternativePosition} from "../AlternativePosition";
import {Explosion} from "./Explosion";
import {CIRCLE_RADIUS, SCALE} from "../game_state/Play";
import {Shoot} from "./Shoot";
import {Player} from "../Player";
import {State} from "../state/State";
import {Stand} from "../state/Stand";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const SHOOT_TIME = Phaser.Timer.SECOND / 2;
const MAKE_ANIM = true;

export class AStarSprite extends MovedSprite
{
    private cellPosition: PIXI.Point;
    private ground: Ground;
    private isNotFreezed: boolean = true;
    private state: State;
    private player: Player;

    constructor(unitRepository: UnitRepository, x: number, y: number, ground: Ground, player: Player) {
        super(
            unitRepository,
            Cell.cellToReal(Cell.realToCell(x)),
            Cell.cellToReal(Cell.realToCell(y)),
            player.getTankKey(),
            1000
        );

        this.player = player;
        this.cellPosition = new PIXI.Point(Cell.realToCell(x), Cell.realToCell(y));
        this.ground = ground;
        this.state = new Stand(this);
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    isPositionAccessible(position: PIXI.Point): boolean {
        return this.ground.isCellAccessible(position) &&
            this.unitRepository.isCellNotOccupied(position);
    };

    update() {
        if (this.isSelected() && this.game.input.activePointer.rightButton.isDown) {
            this.updateState();
        }

        if (this.isNotFreezed) {
            this.state = this.state.getNextStep();
            this.state.run();
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
            if (this.isEnnemyOf(unit)) {
                this.state = new Attack(this, unit);
            } else {
                this.state = new Follow(this, unit);
            }
        } else {
            this.state = new MoveAttack(this, cell);
        }
    }

    isAbleToShoot(ennemy: AStarSprite): boolean {
        return this.distanceTo(ennemy) <= 4;
    }

    private distanceTo(unit: AStarSprite): number {
        return Math.sqrt(
            (this.cellPosition.x - unit.getCellPosition().x) * (this.cellPosition.x - unit.getCellPosition().x) +
            (this.cellPosition.y - unit.getCellPosition().y) * (this.cellPosition.y - unit.getCellPosition().y)
        );
    }

    shootz(ennemy: AStarSprite): void {
        const rotation = this.getRotation(new Phaser.Point(
            ennemy.getCellPosition().x - this.cellPosition.x,
            ennemy.getCellPosition().y - this.cellPosition.y
        ));
        this.loadRotation(rotation);
        this.game.add.existing(new Shoot(this.game, this.x, this.y, rotation));
        ennemy.lostLife(10);

        this.isNotFreezed = false;
        this.unitRepository.play_.game.time.events.add(SHOOT_TIME, () => {
            this.isNotFreezed = true;
        }, this);
    }

    public lostLife(number: number) {
        this.life -= number;

        if (this.life <= 0) {
            this.unitRepository.play_.game.add.existing(new Explosion(this.unitRepository.play_.game, this.x, this.y));
            this.destroy();
            this.unitRepository.removeSprite(this);
        }

        this.updateLife();
    }

    private updateLife()
    {
        this.lifeRectangle.clear();
        this.lifeRectangle.beginFill(0x00ff00);
        this.lifeRectangle.drawRect(
            -CIRCLE_RADIUS/SCALE/2,
            CIRCLE_RADIUS/SCALE/2, this.life / this.maxLife * CIRCLE_RADIUS/SCALE, 2);
    }

    isDestroyed() {
        return this.life <= 0;
    }

    getClosestShootable(): AStarSprite {
        const ennemies = this.unitRepository.getEnnemyUnits(this.player);
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < ennemies.length; i++) {
            const ennemy = (<AStarSprite> ennemies[i]);
            if (ennemy !== this) {
                const distance = this.distanceTo(ennemy);
                if (distance <= 4) {
                    if (null === closest || minDistance > distance) {
                        minDistance = distance;
                        closest = ennemy;
                    }
                }
            }
        }

        return closest;
    }

    private isEnnemyOf(unit: AStarSprite) {
        return unit.getPlayer() !== this.player;
    }

    getPlayer() {
        return this.player;
    }

    moveTowards(goal: PIXI.Point) {
        const nextStep = AStar.nextStep(this.cellPosition, goal, this.isPositionAccessible.bind(this));

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

            this.isNotFreezed = false;
            this.unitRepository.play_.game.time.events.add(MOVE_TIME, () => {
                this.isNotFreezed = true;
            }, this);
        }
    }
}
