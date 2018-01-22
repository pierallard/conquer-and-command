import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";
import {GROUP} from "../game_state/Play";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {Shootable} from "../Shootable";
import {AttackReload} from "../state/AttackReload";
import {Army} from "../Army";
import {Helipad} from "../building/Helipad";
import {Cell} from "../computing/Cell";
import {Reload} from "../state/Reload";

const SHOOT_COUNTER = 5;
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
        return this.getCurrentHelipad() !== null;
    }

    getCurrentHelipad(): Helipad {
        const helipads = this.worldKnowledge.getPlayerArmies(this.getPlayer(), 'Helipad');
        for (let i = 0; i < helipads.length; i++) {
            for (let j = 0; j < helipads[i].getCellPositions().length; j++) {
                if (helipads[i].getCellPositions()[j].x === this.cellPosition.x &&
                    helipads[i].getCellPositions()[j].y === this.cellPosition.y) {
                    return (<Helipad> helipads[i]);
                }
            }
        }

        return null;
    }

    isFullyReloaded(): boolean {
        return this.counter === SHOOT_COUNTER;
    }

    reload() {
        this.counter++;
        (<OrcaSprite> this.unitSprite).updateCounter(this.counter);
        (<OrcaSprite> this.unitSprite).landIfNeeded(this.getHelipadCenter());
        this.freeze(2 * Phaser.Timer.SECOND);
        this.getCurrentHelipad().runLoadAnimation();
        this.getCurrentHelipad().setLoading(true);

        if (this.counter >= SHOOT_COUNTER) {
            this.timerEvents.add((2 - UNLAND_TIME) * Phaser.Timer.SECOND, () => {
                this.unlandIfNeeded();
                this.getCurrentHelipad().setLoading(false);
            }, this);
        }
    }

    unlandIfNeeded() {
        (<OrcaSprite> this.unitSprite).unlandIfNeeded(this.cellPosition);
    }

    updateStateAfterClick(cell: PIXI.Point) {
        const army = this.worldKnowledge.getArmyAt(cell);
        if (
            null !== army &&
            army instanceof Helipad &&
            army.getPlayer() === this.player &&
            (!(<Helipad> army).isLoading())
        ) {
            this.state = new Reload(this, (<Helipad> army));

            return;
        }

        super.updateStateAfterClick(cell);
    }

    protected getAttackState(army: Army) {
        return new AttackReload(this.worldKnowledge, this, army);
    }

    private getHelipadCenter(): PIXI.Point {
        const cellPosition = this.getCurrentHelipad().getCellPositions()[0];
        return new PIXI.Point(
            Cell.cellToReal(cellPosition.x + 0.5),
            Cell.cellToReal(cellPosition.y - 0.7),
        )
    }
}
