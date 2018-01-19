import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";
import {GROUP} from "../game_state/Play";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {Shootable} from "../Shootable";

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
}
