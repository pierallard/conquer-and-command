import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";
import {GROUP} from "../game_state/Play";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {Shootable} from "../Shootable";
import {AttackReload} from "../state/AttackReload";
import {Army} from "../Army";

const SHOOT_COUNTER = 2;
export const UNLAND_TIME = 0.5;

export class Orca extends Unit {
    private counter: number;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
        this.counter = SHOOT_COUNTER;
    }

    create(game: Phaser.Game, groups) {
        this.effectsGroup = groups[GROUP.EFFECTS];
        this.timerEvents = game.time.events;
        this.unitSprite = new OrcaSprite(game, groups, this.cellPosition, this.counter);
    }

    isOnGround(): boolean {
        return false;
    }

    shoot(enemy: Shootable): void {
        this.counter--;
        (<OrcaSprite> this.unitSprite).updateCounter(this.counter);

        super.shoot(enemy);
    }

    canShoot(): boolean {
        return this.counter > 0;
    }

    isOnHelipad(): boolean {
        const helipads = this.worldKnowledge.getPlayerArmies(this.getPlayer(), 'Helipad');
        for (let i = 0; i < helipads.length; i++) {
            for (let j = 0; j < helipads[i].getCellPositions().length; j++) {
                if (helipads[i].getCellPositions()[j].x === this.cellPosition.x &&
                    helipads[i].getCellPositions()[j].y === this.cellPosition.y) {
                    return true;
                }
            }
        }

        return false;
    }

    isFullyReloaded(): boolean {
        return this.counter === SHOOT_COUNTER;
    }

    reload() {
        this.counter++;
        (<OrcaSprite> this.unitSprite).updateCounter(this.counter);
        (<OrcaSprite> this.unitSprite).landIfNeeded();
        this.freeze(2 * Phaser.Timer.SECOND);

        if (this.counter >= SHOOT_COUNTER) {
            this.timerEvents.add((2 - UNLAND_TIME) * Phaser.Timer.SECOND, () => {
                this.unlandIfNeeded();
            }, this);
        }
    }

    unlandIfNeeded() {
        (<OrcaSprite> this.unitSprite).unlandIfNeeded();
    }

    protected getAttackState(army: Army) {
        return new AttackReload(this.worldKnowledge, this, army);
    }
}
