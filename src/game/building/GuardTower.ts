import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {GuardTowerSprite} from "../sprite/GuardTowerSprite";
import {Shootable} from "../Shootable";
import {BuildingProperties} from "./BuildingProperties";
import {Distance} from "../computing/Distance";
import {SHOOT_COOLDOWN_RATIO} from "../unit/UnitProperties";

export class GuardTower extends ConstructableBuilding {
    private isFrozen: boolean;
    private timerEvents: Phaser.Timer;

    constructor(worldKnowledge: WorldKnowledge, cell: PIXI.Point, player: Player) {
        super(worldKnowledge, cell, player);
        this.isFrozen = false;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.sprite = new GuardTowerSprite(
            game,
            group,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'Turret'
        );
        this.timerEvents = game.time.events;
    }

    update() {
        if (!this.isFrozen) {
            const shootable = this.getClosestShootable();
            if (shootable) {
                this.shoot(shootable);
            }
        }

        super.update();
    }

    shoot(enemy: Shootable): void {
        (<GuardTowerSprite> this.sprite).doShoot(enemy.getCellPositions()[0]);
        enemy.lostLife(BuildingProperties.getOption(this.constructor.name, 'shoot_power'));
        this.freeze(
            BuildingProperties.getOption(this.constructor.name, 'shoot_cooldown') *
            Phaser.Timer.SECOND *
            SHOOT_COOLDOWN_RATIO
        );
    }

    private freeze(time: number) {
        this.isFrozen = true;
        this.timerEvents.add(time, () => {
            this.isFrozen = false;
        }, this);
    }

    private getClosestShootable(): Shootable {
        const enemies = this.worldKnowledge.getEnemies(this.player);
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy !== this) {
                const distance = Distance.to(this.cellPosition, enemy.getCellPositions());
                if (distance <= BuildingProperties.getOption(this.constructor.name, 'shoot_distance')) {
                    if (null === closest || minDistance > distance) {
                        minDistance = distance;
                        closest = enemy;
                    }
                }
            }
        }

        return closest;
    }
}
