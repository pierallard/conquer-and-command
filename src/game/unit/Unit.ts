import {AStar, Path} from "../computing/AStar";
import {Player} from "../player/Player";
import {State} from "../state/State";
import {Stand} from "../state/Stand";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {UnitSprite} from "../sprite/UnitSprite";
import {Distance} from "../computing/Distance";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Shootable} from "../Shootable";
import {Positionnable} from "../Positionnable";
import {Rocket} from "../shoot/Rocket";
import {Cell} from "../computing/Cell";
import {Bullet} from "../shoot/Bullet";
import {Army} from "../Army";
import {MoveTo} from "../state/MoveTo";
import {GROUP} from "../game_state/Play";

export abstract class Unit implements Army, Shootable, Positionnable {
    protected life: number;
    protected maxLife: number;
    protected unitSprite: UnitSprite;
    protected state: State;
    protected player: Player;
    protected worldKnowledge: WorldKnowledge;
    protected cellPosition: PIXI.Point;
    protected timerEvents: Phaser.Timer;
    protected effectsGroup: Phaser.Group;
    private pathCache: Path;
    private goalCache: PIXI.Point;
    private isFrozen: boolean = false;
    private selected: boolean = false;
    private key: string;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.cellPosition = cellPosition;
        this.player = player;
        this.state = new Stand(this);
        this.key = UnitProperties.getSprite(this.constructor.name, player.getId());
        this.life = this.maxLife = UnitProperties.getLife(this.constructor.name);
    }

    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.effectsGroup = groups[GROUP.EFFECTS];
        this.timerEvents = game.time.events;
        this.unitSprite = new UnitSprite(
            game,
            groups,
            this.cellPosition,
            this.key,
            UnitProperties.getImageFormat(this.constructor.name)
        );
    }

    update(): void {
        if (!this.isFrozen) {
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

    getShootDistance(): number {
        return UnitProperties.getShootDistance(this.constructor.name);
    }

    isAlive(): boolean {
        return this.life > 0;
    }

    isSelected(): boolean {
        return this.selected;
    }

    shoot(enemy: Shootable): void {
        let closestEnemyPosition = Distance.getClosestPosition(this.getCellPositions()[0], enemy.getCellPositions());
        enemy.lostLife(UnitProperties.getShootPower(this.constructor.name));
        this.freeze(UnitProperties.getShootTime(this.constructor.name) * Phaser.Timer.SECOND);
        this.unitSprite.rotateTowards(closestEnemyPosition);

        switch (UnitProperties.getShootType(this.constructor.name)) {
            case 'rocket':
                new Rocket(this.effectsGroup, this.getShootSource(closestEnemyPosition), new PIXI.Point(
                    Cell.cellToReal(closestEnemyPosition.x),
                    Cell.cellToReal(closestEnemyPosition.y)
                ));
                break;
            default:
                new Bullet(this.effectsGroup, this.getShootSource(closestEnemyPosition), new PIXI.Point(
                    Cell.cellToReal(closestEnemyPosition.x),
                    Cell.cellToReal(closestEnemyPosition.y)
                ));
        }
    }

    lostLife(life: number) {
        this.life -= life;
        if (!this.isAlive()) {
            this.unitSprite.doDestroy();
            this.worldKnowledge.removeArmy(this);
        }

        this.unitSprite.updateLife(this.life, this.maxLife);
    }

    getClosestShootable(): Shootable {
        const enemies = this.worldKnowledge.getEnemyArmies(this.player);
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy !== this) {
                if (enemy.isOnGround() || UnitProperties.getShootAirPower(this.constructor.name) > 0) {
                    const distance = Distance.to(this.cellPosition, enemy.getCellPositions());
                    if (distance <= this.getShootDistance()) {
                        if (null === closest || minDistance > distance) {
                            minDistance = distance;
                            closest = enemy;
                        }
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
            if (this.pathCache.isStillAvailable(
                this.isOnGround() ?
                    this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge) :
                    this.worldKnowledge.isAerialCellAccessible.bind(this.worldKnowledge)
                )) {
                nextStep = this.pathCache.splice();
            }
        }
        if (!nextStep) {
            const newPath = AStar.getPathOrClosest(
                this.cellPosition,
                goal,
                this.isOnGround() ?
                    this.worldKnowledge.isGroundCellAccessible.bind(this.worldKnowledge) :
                    this.worldKnowledge.isAerialCellAccessible.bind(this.worldKnowledge)
            );
            if (null !== newPath) {
                this.pathCache = newPath;
                this.goalCache = goal;
                nextStep = this.pathCache.splice();
            } else if (null !== this.pathCache &&
                this.pathCache.firstStep() &&
                (this.isOnGround() ?
                    this.worldKnowledge.isGroundCellAccessible(this.pathCache.firstStep()) :
                    this.worldKnowledge.isAerialCellAccessible(this.pathCache.firstStep()))
            ) {
                nextStep = this.pathCache.splice();
            }
        }

        if (nextStep) {
            this.cellPosition = nextStep;
            this.unitSprite.doMove(
                nextStep,
                UnitProperties.getSlownessTime(this.constructor.name) * Phaser.Timer.SECOND
            );
            this.freeze(UnitProperties.getSlownessTime(this.constructor.name) * Phaser.Timer.SECOND);
        }
    }

    setSelected(value: boolean = true) {
        this.selected = value;
        this.unitSprite.setSelected(value);
    }

    updateStateAfterClick(cell: PIXI.Point) {
        const army = this.worldKnowledge.getArmyAt(cell);
        if (null !== army) {
            if (this.getPlayer() !== army.getPlayer()) {
                if (army.isOnGround() || UnitProperties.getShootAirPower(this.constructor.name) > 0) {
                    this.state = new Attack(this.worldKnowledge, this, army);
                } else {
                    this.state = new MoveTo(this.worldKnowledge, this, cell);
                }
            } else if (army instanceof Unit) {
                this.state = new Follow(this.worldKnowledge, this, army);
            } else {
                this.state = new MoveTo(this.worldKnowledge, this, cell);
            }
        } else {
            this.state = new MoveTo(this.worldKnowledge, this, cell);
        }
    }

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return this.unitSprite.isInside(left, right, top, bottom);
    }

    destroy() {
        this.unitSprite.destroy(true);
    }

    orderMoveAttack(goal: PIXI.Point): void {
        this.state = new MoveAttack(this.worldKnowledge, this, goal);
    }

    setVisible(value: boolean) {
        this.unitSprite.alpha = value ? 1 : 0;
    }

    isOnGround(): boolean {
        return true;
    }

    canShoot(): boolean {
        return true;
    }

    protected getShootSource(cellDest: PIXI.Point): PIXI.Point {
        return new PIXI.Point(Cell.cellToReal(this.cellPosition.x), Cell.cellToReal(this.cellPosition.y));
    }

    protected freeze(time: number) {
        this.isFrozen = true;
        this.timerEvents.add(time, () => {
            this.isFrozen = false;
        }, this);
    }
}
