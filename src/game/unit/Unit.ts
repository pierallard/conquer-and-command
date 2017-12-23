import {Cell} from "../Cell";
import {AStar, Path} from "../AStar";
import {Player} from "../player/Player";
import {State} from "../state/State";
import {Stand} from "../state/Stand";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {UnitSprite} from "../sprite/UnitSprite";
import {Distance} from "../Distance";

const MOVE_TIME = Phaser.Timer.SECOND / 4;
const SHOOT_TIME = Phaser.Timer.SECOND / 2;

export abstract class Unit {
    protected life: number = 100;
    protected maxLife: number = 100;
    protected unitSprite: UnitSprite;
    protected state: State;
    protected player: Player;
    private pathCache: Path;
    private goalCache: PIXI.Point;
    private cellPosition: PIXI.Point;
    private isFreezed: boolean = false;
    private selected: boolean = false;

    constructor(player: Player, x: number, y: number, group: Phaser.Group, key: string) {
        this.unitSprite = new UnitSprite(
            player.getUnitRepository().play.game,
            Cell.cellToReal(Cell.realToCell(x)),
            Cell.cellToReal(Cell.realToCell(y)),
            group,
            key
        );

        this.player = player;
        this.cellPosition = new PIXI.Point(Cell.realToCell(x), Cell.realToCell(y));
        this.state = new Stand(this);
    }

    update(): void {
        if (!this.isFreezed) {
            this.state = this.state.getNextStep();
            this.state.run();
        }
    }

    getCellPositions(): PIXI.Point[] {
        return [this.cellPosition];
    }

    getPlayer(): Player {
        return this.player;
    }

    abstract getShootDistance(): number;

    isAlive(): boolean {
        return this.life > 0;
    }

    isSelected(): boolean {
        return this.selected;
    }

    shoot(ennemy: Unit): void {
        this.unitSprite.doShoot(ennemy.getCellPositions()[0]);
        ennemy.lostLife(10);
        this.freeze(SHOOT_TIME);
    }

    lostLife(life: number) {
        this.life -= life;
        if (!this.isAlive()) {
            this.unitSprite.doDestroy();
            this.player.getUnitRepository().removeSprite(this);
        }

        this.unitSprite.updateLife(this.life, this.maxLife);
    }

    getClosestShootable(): Unit {
        const enemies = this.player.getEnnemyUnits();
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = (<Unit> enemies[i]);
            if (enemy !== this) {
                const distance = Distance.to(this.cellPosition, enemy.getCellPositions());
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
        if (goal !== this.goalCache) {
            this.goalCache = null;
            this.pathCache = null;
        }
        let nextStep = null;
        if (this.pathCache) {
            if (this.pathCache.isStillAvailable(this.getPlayer().isPositionAccessible.bind(this.getPlayer()))) {
                nextStep = this.pathCache.splice();
            }
        }
        if (!nextStep) {
            const newPath = AStar.getPath(
                this.cellPosition,
                goal,
                this.getPlayer().isPositionAccessible.bind(this.getPlayer())
            );
            if (null !== newPath) {
                this.pathCache = newPath;
                this.goalCache = goal;
                nextStep = this.pathCache.splice();
            }
        }

        if (nextStep) {
            this.cellPosition = nextStep;
            this.unitSprite.doMove(nextStep, MOVE_TIME);
            this.freeze(MOVE_TIME);
        }
    }

    setSelected(value: boolean = true) {
        this.selected = value;
        this.unitSprite.setSelected(value);
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

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return this.unitSprite.isInside(left, right, top, bottom);
    }

    protected freeze(time: number) {
        this.isFreezed = true;
        this.player.getUnitRepository().play.game.time.events.add(time, () => {
            this.isFreezed = false;
        }, this);
    }

}
