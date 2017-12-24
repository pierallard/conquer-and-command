import {SCALE} from "../game_state/Play";
import {Explosion} from "./Explosion";

export class BuildingSprite extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);

        this.scale.setTo(SCALE);
    }

    doDestroy() {
        this.doExplodeEffect();
        this.destroy(true);
    }

    private doExplodeEffect() {
        // this.game.add.existing(new Explosion(this.game, this.x, this.y));
    }
}
