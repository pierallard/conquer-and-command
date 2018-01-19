import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";
import {GROUP} from "../game_state/Play";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {Shootable} from "../Shootable";
import {UnitProperties} from "./UnitProperties";
import {AttackReload} from "../state/AttackReload";
import {MoveTo} from "../state/MoveTo";
import {Follow} from "../state/Follow";

const SHOOT_COUNTER = 5;

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

        this.freeze(2 * Phaser.Timer.SECOND);
    }

    updateStateAfterClick(cell: PIXI.Point) {
        const army = this.worldKnowledge.getArmyAt(cell);
        if (null !== army) {
            if (this.getPlayer() !== army.getPlayer()) {
                if (army.isOnGround() || UnitProperties.getShootAirPower(this.constructor.name) > 0) {
                    this.state = new AttackReload(this.worldKnowledge, this, army);
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
}
