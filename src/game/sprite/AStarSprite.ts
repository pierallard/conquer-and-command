import {MovedSprite} from "./MovedSprite";
import {Cell} from "../Cell";
import {AStar} from "../AStar";
import {Explosion} from "./Explosion";
import {CIRCLE_RADIUS, SCALE} from "../game_state/Play";
import {Shoot} from "./Shoot";
import {Player} from "../player/Player";
import {State} from "../state/State";
import {Stand} from "../state/Stand";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const SHOOT_TIME = Phaser.Timer.SECOND / 2;
const SHOOT_DISTANCE = 4;

export class AStarSprite extends MovedSprite {
    private cellPosition: PIXI.Point;
    private state: State;
    private player: Player;
    private isFreezed: boolean = false;

    constructor(player: Player, x: number, y: number, ) {
        super(
            player.getUnitRepository().play_.game,
            Cell.cellToReal(Cell.realToCell(x)),
            Cell.cellToReal(Cell.realToCell(y)),
            player.getTankKey(),
            1000
        );

        this.player = player;
        this.cellPosition = new PIXI.Point(Cell.realToCell(x), Cell.realToCell(y));
        this.state = new Stand(this);
    }

    update() {
        if (!this.isFreezed) {
            this.state = this.state.getNextStep();
            this.state.run();
        }

        super.update();
    }

    attack(unit: AStarSprite) {
        this.state = new Attack(this, unit);
    }

    follow(unit: AStarSprite) {
        this.state = new Follow(this, unit);
    }

    move(cell: PIXI.Point) {
        this.state = new MoveAttack(this, cell);
    }

    getCellPosition(): PIXI.Point {
        return this.cellPosition;
    }

    getPlayer() {
        return this.player;
    }

    getShootDistance() {
        return SHOOT_DISTANCE;
    }

    isAlive() {
        return this.life > 0;
    }

    shoot(ennemy: AStarSprite): void {
        this.rotateTowards(ennemy.getCellPosition());
        this.doShootEffect(ennemy.getCellPosition());
        ennemy.lostLife(10);
        this.freeze(SHOOT_TIME);
    }

    lostLife(number: number) {
        this.life -= number;
        if (!this.isAlive()) {
            this.doExplodeEffect();
            this.destroy(true);
            this.player.getUnitRepository().removeSprite(this);
        }

        this.updateLife();
    }

    getClosestShootable(): AStarSprite {
        const enemies = this.player.getEnnemyUnits();
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = (<AStarSprite> enemies[i]);
            if (enemy !== this) {
                const distance = this.distanceTo(enemy);
                if (distance <= this.getShootDistance()) {
                    if (null === closest || minDistance > distance) {
                        minDistance = distance;
                        closest = enemy;
                    }
                }
            }
        }

        return closest;
    }

    moveTowards(goal: PIXI.Point) {
        // TODO avoid recomputing of A* when path is accessible
        const nextStep = AStar.nextStep(
            this.cellPosition,
            goal,
            this.getPlayer().isPositionAccessible.bind(this.getPlayer())
        );

        if (nextStep) {
            this.rotateTowards(nextStep);
            this.cellPosition = nextStep;

            this.game.add.tween(this).to({
                x: Cell.cellToReal(this.cellPosition.x),
                y: Cell.cellToReal(this.cellPosition.y)
            }, MOVE_TIME, Phaser.Easing.Default, true);

            this.freeze(MOVE_TIME);
        }
    }

    private distanceTo(unit: AStarSprite): number {
        return Math.sqrt(
            (this.cellPosition.x - unit.getCellPosition().x) * (this.cellPosition.x - unit.getCellPosition().x) +
            (this.cellPosition.y - unit.getCellPosition().y) * (this.cellPosition.y - unit.getCellPosition().y)
        );
    }

    private updateLife() {
        this.lifeRectangle.clear();
        this.lifeRectangle.beginFill(0x00ff00);
        this.lifeRectangle.drawRect(
            -CIRCLE_RADIUS/SCALE/2,
            CIRCLE_RADIUS/SCALE/2, this.life / this.maxLife * CIRCLE_RADIUS/SCALE, 2);
    }

    private rotateTowards(cellPosition: PIXI.Point): void {
        const rotation = this.getRotation(new Phaser.Point(
            cellPosition.x - this.cellPosition.x,
            cellPosition.y - this.cellPosition.y
        ));
        this.loadRotation(rotation);
    }

    private doShootEffect(cellPosition: PIXI.Point) {
        const rotation = this.getRotation(new Phaser.Point(
            cellPosition.x - this.cellPosition.x,
            cellPosition.y - this.cellPosition.y
        ));
        this.game.add.existing(new Shoot(this.game, this.x, this.y, rotation));
    }

    private freeze(time: number) {
        this.isFreezed = true;
        this.game.time.events.add(time, () => {
            this.isFreezed = false;
        }, this);
    }

    private doExplodeEffect() {
        this.game.add.existing(new Explosion(this.game, this.x, this.y));
    }
}
