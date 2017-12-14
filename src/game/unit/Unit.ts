import {Cell} from "../Cell";
import {AStar} from "../AStar";
import {Explosion} from "../sprite/Explosion";
import {CIRCLE_RADIUS, SCALE} from "../game_state/Play";
import {Shoot} from "../sprite/Shoot";
import {Player} from "../player/Player";
import {State} from "../state/State";
import {Stand} from "../state/Stand";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {Building} from "../building/Building";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const SHOOT_TIME = Phaser.Timer.SECOND / 2;
const SHOOT_DISTANCE = 4;

export enum Rotation {
    TOP = 1,
    TOP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT
}

export abstract class Unit extends Phaser.Sprite {
    private cellPosition: PIXI.Point;
    protected state: State;
    protected player: Player;
    private isFreezed: boolean = false;
    private life: number = 100;
    private maxLife: number = 100;
    private lifeRectangle: Phaser.Graphics;
    private selectedRectable: Phaser.Graphics = null;

    constructor(player: Player, x: number, y: number, key: string) {
        super(
            player.getUnitRepository().play_.game,
            Cell.cellToReal(Cell.realToCell(x)),
            Cell.cellToReal(Cell.realToCell(y)),
            key
        );

        this.scale.setTo(SCALE, SCALE);
        this.anchor.setTo(0.5, 0.5)
        this.player = player;
        this.cellPosition = new PIXI.Point(Cell.realToCell(x), Cell.realToCell(y));
        this.state = new Stand(this);

        this.lifeRectangle = this.game.add.graphics(0, 0);
        this.lifeRectangle.beginFill(0x00ff00);
        this.lifeRectangle.drawRect(-CIRCLE_RADIUS/SCALE/2, CIRCLE_RADIUS/SCALE/2, CIRCLE_RADIUS/SCALE, 2);
        this.addChild(this.lifeRectangle);

        this.game.add.existing(this);
    }

    update() {
        if (!this.isFreezed) {
            this.state = this.state.getNextStep();
            this.state.run();
        }

        super.update();
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

    isSelected() {
        return this.selectedRectable !== null;
    }

    shoot(ennemy: Unit): void {
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

    getClosestShootable(): Unit {
        const enemies = this.player.getEnnemyUnits();
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = (<Unit> enemies[i]);
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

    setSelected(value: boolean) {
        if (value) {
            if (null === this.selectedRectable) {
                this.selectedRectable = this.game.add.graphics(0, 0);
                this.selectedRectable.lineStyle(1, 0x00ff00, 0.5);
                this.selectedRectable.drawRect(-CIRCLE_RADIUS / SCALE / 2, -CIRCLE_RADIUS / SCALE / 2, CIRCLE_RADIUS / SCALE, CIRCLE_RADIUS / SCALE);
                this.addChild(this.selectedRectable);
            }
        } else if (this.selectedRectable !== null) {
            this.selectedRectable.destroy();
            this.selectedRectable = null;
        }
    }

    protected distanceTo(unit: Unit | Building): number {
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

    protected rotateTowards(cellPosition: PIXI.Point): void {
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

    protected freeze(time: number) {
        this.isFreezed = true;
        this.game.time.events.add(time, () => {
            this.isFreezed = false;
        }, this);
    }

    private doExplodeEffect() {
        this.game.add.existing(new Explosion(this.game, this.x, this.y));
    }

    private getRotation(vector: PIXI.Point): Rotation
    {
        if (null === vector) {
            return Rotation.TOP_LEFT;
        }

        const angle = Math.atan2(vector.y, vector.x);
        if (angle > Math.PI/8 * 7) {
            return Rotation.LEFT;
        }
        if (angle > Math.PI/8 * 5) {
            return Rotation.BOTTOM_LEFT;
        }
        if (angle > Math.PI/8 * 3) {
            return Rotation.BOTTOM;
        }
        if (angle > Math.PI/8) {
            return Rotation.BOTTOM_RIGHT;
        }
        if (angle > Math.PI/8 * -1) {
            return Rotation.RIGHT;
        }
        if (angle > Math.PI/8 * -3) {
            return Rotation.TOP_RIGHT;
        }
        if (angle > Math.PI/8 * -5) {
            return Rotation.TOP;
        }
        if (angle > Math.PI/8 * -7) {
            return Rotation.TOP_LEFT;
        }

        return Rotation.LEFT;
    }

    private loadRotation(rotation: Rotation)
    {
        switch(rotation) {
            case Rotation.TOP: this.loadTexture(this.key, 1); break;
            case Rotation.TOP_RIGHT: this.loadTexture(this.key, 2); break;
            case Rotation.RIGHT: this.loadTexture(this.key, 5); break;
            case Rotation.BOTTOM_RIGHT: this.loadTexture(this.key, 8); break;
            case Rotation.BOTTOM: this.loadTexture(this.key, 7); break;
            case Rotation.BOTTOM_LEFT: this.loadTexture(this.key, 6); break;
            case Rotation.LEFT: this.loadTexture(this.key, 3); break;
            case Rotation.TOP_LEFT: this.loadTexture(this.key, 0); break;
        }
    }

    updateStateAfterclick(cell: PIXI.Point) {
        const unit = this.player.getUnitRepository().unitAt(cell);
        if (null !== unit) {
            if (this.getPlayer() !== unit.getPlayer()) {
                this.state = new Attack(this, unit);
            } else {
                this.state = new Follow(this, unit);
            }
        } else {
            this.state = new MoveAttack(this, cell);
        }
    }
}
