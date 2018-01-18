import {Unit} from "./Unit";
import {OrcaSprite} from "../sprite/OrcaSprite";

export class Orca extends Unit {
    create(game: Phaser.Game, unitGroup: Phaser.Group, effectsGroup: Phaser.Group, aerialGroup: Phaser.Group) {
        this.effectsGroup = effectsGroup;
        this.timerEvents = game.time.events;
        this.unitSprite = new OrcaSprite(
            game,
            aerialGroup,
            this.cellPosition
        );
    }
}
