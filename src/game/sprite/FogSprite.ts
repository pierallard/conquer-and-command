import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";
import {GAME_HEIGHT, GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {Cell} from "../computing/Cell";

const SECURITY_MARGIN = 3;

export class FogSprite {
    private graphics: Phaser.Graphics;
    private camera: Phaser.Camera;
    private lastCameraPosition: PIXI.Point;

    create(game: Phaser.Game, group: Phaser.Group) {
        this.graphics = new Phaser.Graphics(game, 0, 0);
        this.graphics.scale.set(SCALE, SCALE);
        this.camera = game.camera;
        this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);

        group.add(this.graphics);
    }

    update(knownCells: boolean[][], force: boolean) {
        if (force ||
            this.camera.position.x !== this.lastCameraPosition.x ||
            this.camera.position.y !== this.lastCameraPosition.y)
        {
            this.graphics.clear();
            this.graphics.beginFill(0x0000, 0.5);

            const top = Cell.realToCell(this.graphics.game.camera.position.y);
            const left = Cell.realToCell(this.graphics.game.camera.position.x);
            const height = Cell.realToCell(GAME_HEIGHT);
            const width = Cell.realToCell(GAME_WIDTH - INTERFACE_WIDTH);

            for (let y = top - SECURITY_MARGIN; y < top + height + 1 + SECURITY_MARGIN; y++) {
                for (let x = left - SECURITY_MARGIN; x < left + width + 1 + SECURITY_MARGIN; x++) {
                    if (undefined !== knownCells[y] && undefined !== knownCells[y][x] && !knownCells[y][x]) {
                        this.graphics.drawRect(x * GROUND_SIZE, y * GROUND_SIZE, GROUND_SIZE, GROUND_SIZE);
                    }
                }
            }

            this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
        }
    }
}
