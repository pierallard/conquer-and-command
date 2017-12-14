import Play, {SCALE} from "./game_state/Play";

export const GROUND_SIZE = 20;

export class Ground {
    private obstacles: PIXI.Point[] = [];
    private map: Phaser.Tilemap;

    constructor(play: Play)
    {
        this.map = play.game.add.tilemap('basicmap');
        this.map.addTilesetImage('GrasClif', 'GrasClif');
        this.map.addTilesetImage('GrssMisc', 'GrssMisc');
        let layer = this.map.createLayer('layer');
        layer.scale.setTo(SCALE, SCALE);
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                let index = this.map.getTile(x, y, layer).index;
                if (index !== 13) {
                    this.obstacles.push(new PIXI.Point(x, y));
                }
            }
        }
    }

    isCellAccessible(position: PIXI.Point): boolean {
        if (position.x < 0 || position.x >= this.map.width || position.y < 0 || position.y >= this.map.height) {
            return false;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].x === position.x && this.obstacles[i].y === position.y) {
                return false;
            }
        }

        return true;
    }
}
