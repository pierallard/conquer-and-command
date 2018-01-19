import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";
import {GROUP} from "../game_state/Play";

export class Orca extends Unit {
    create(game: Phaser.Game, groups) {
        this.effectsGroup = groups[GROUP.EFFECTS];
        this.timerEvents = game.time.events;
        this.unitSprite = new OrcaSprite(
            game,
            groups,
            this.cellPosition
        );
    }

    isOnGround(): boolean {
        return false;
    }
}
