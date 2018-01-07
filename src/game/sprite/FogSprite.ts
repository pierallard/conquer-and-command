import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";

export class FogSprite {
    private graphics: Phaser.Graphics;

    create(game: Phaser.Game, group: Phaser.Group) {
        this.graphics = new Phaser.Graphics(game, 0, 0);
        this.graphics.scale.set(SCALE, SCALE);

        group.add(this.graphics);
    }

    update(knownCells: boolean[][]) {
        this.graphics.clear();
        this.graphics.beginFill(0x0000, 0.5);
        for (let y = 0; y < knownCells.length; y++) {
            for (let x = 0; x < knownCells[y].length; x++) {
                if (!knownCells[y][x]) {
                    this.graphics.drawRect(x * GROUND_SIZE, y * GROUND_SIZE, GROUND_SIZE, GROUND_SIZE);
                }
            }
        }
    }
}
