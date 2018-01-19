import {GROUP, SCALE} from "../game_state/Play";
import {Explosion} from "./Explosion";
import {LifeRectangle} from "./LifeRectangle";
import {SelectRectangle} from "./SelectRectangle";

export class BuildingSprite extends Phaser.Sprite {
    protected group: Phaser.Group;
    protected effectsGroup: Phaser.Group;
    protected lifeRectangle: LifeRectangle;
    protected selectedRectangle: SelectRectangle;
    private timerEvents: Phaser.Timer;

    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, x, y, key);
        this.group = groups[GROUP.UNIT];
        this.effectsGroup = groups[GROUP.EFFECTS];

        this.scale.setTo(SCALE);
        this.group.add(this);
        this.timerEvents = game.time.events;

        this.selectedRectangle = new SelectRectangle(game, this.width / SCALE, this.height / SCALE);
        this.addChild(this.selectedRectangle);

        this.lifeRectangle = new LifeRectangle(game, this.width / SCALE, this.height / SCALE);
        this.addChild(this.lifeRectangle);
    }

    doDestroy() {
        this.doExplodeEffect();
        this.timerEvents.add(0.3 * Phaser.Timer.SECOND, () => {
            this.destroy(true);
        });
    }

    setSelected(value: boolean) {
        this.selectedRectangle.setVisible(value);
        this.lifeRectangle.setVisible(value);
    }

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return this.x + this.width / 2 > left &&
            this.x - this.width / 2 < right &&
            this.y + this.height / 2 > top &&
            this.y - this.height / 2 < bottom;
    }

    updateLife(life: number, maxLife: number) {
        this.lifeRectangle.updateLife(life / maxLife);
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
