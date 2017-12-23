import {SCALE} from "../game_state/Play";
export class BuildingSprite extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number, key: string) {
        super(game, x, y, key);

        this.scale.setTo(SCALE);
    }
}
