import {SCALE} from "../game_state/Play";

export const GROUND_SIZE = 20;

export class Ground {
    private obstacles: PIXI.Point[] = [];
    private map: Phaser.Tilemap;

    constructor(game: Phaser.Game) {
        this.map = game.add.tilemap('basicmap');
        // this.map = new Phaser.Tilemap(game, 'basicmap');
        this.map.addTilesetImage('GrasClif', 'GrasClif');
        this.map.addTilesetImage('GrssMisc', 'GrssMisc');
        let layer = this.map.createLayer('layer');
        layer.scale.setTo(SCALE, SCALE);
        game.add.existing(layer);

        this.initializeObstacles();
    }

    isCellAccessible(position: PIXI.Point): boolean {
        if (position.x < 0 || position.x >= this.map.width || position.y < 0 || position.y >= this.map.height) {
            return false;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].x === position.x && this.obstacles[i].y === position.y) {
                return false;
            }
        }

        return true;
    }

    getGroundWidth() {
        return this.map.widthInPixels * SCALE;
    }

    getGroundHeight() {
        return this.map.heightInPixels * SCALE;
    }

    private initializeObstacles() {
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                let index = this.map.getTile(x, y).index;
                if (index !== 13) {
                    this.obstacles.push(new PIXI.Point(x, y));
                }
            }
        }
    }
}
