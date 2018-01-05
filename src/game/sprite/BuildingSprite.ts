import {SCALE} from "../game_state/Play";
import {Explosion} from "./Explosion";

export class BuildingSprite extends Phaser.Sprite {
    protected group: Phaser.Group;
    protected effectsGroup: Phaser.Group;
    private timerEvents: Phaser.Timer;

    constructor(game: Phaser.Game, group: Phaser.Group, effectsGroup: Phaser.Group, x: number, y: number, key: string) {
        super(game, x, y, key);
        this.group = group;
        this.scale.setTo(SCALE);
        this.group.add(this);
        this.timerEvents = game.time.events;
        this.effectsGroup = effectsGroup;
    }

    doDestroy() {
        this.doExplodeEffect();
        this.timerEvents.add(0.3 * Phaser.Timer.SECOND, () => {
            this.destroy(true);
        });
    }

    private doExplodeEffect() {
        this.group.add(new Explosion(
            this.game,
            (this.right - this.left) / 2 + this.left,
            (this.bottom - this.top) / 2 + this.top,
            Math.max(this.right - this.left, this.bottom - this.top)
        ));
    }
}
