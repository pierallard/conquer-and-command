import Play, {SCALE} from "./state/Play";

export const GROUND_SIZE = 20;
const PROBA_NON_OBSTACLE = 0.6;

export class Ground {
    private obstacles: PIXI.Point[];
    private cellSize: PIXI.Point;

    constructor(play: Play)
    {
        this.cellSize = new PIXI.Point(
            Math.floor(play.game.width / (SCALE * GROUND_SIZE)),
            Math.floor(play.game.height / (SCALE * GROUND_SIZE)),
        );

        this.obstacles = [];
        const tileFrames = [18, 20, 32, 34, 36];
        for (let i = 0; i < this.cellSize.x; i++) {
            for (let j = 0; j < this.cellSize.y; j++) {
                if (Math.random() < PROBA_NON_OBSTACLE) {
                    play.game.add
                        .tileSprite(
                            i * SCALE * GROUND_SIZE,
                            j * SCALE * GROUND_SIZE,
                            GROUND_SIZE,
                            GROUND_SIZE,
                            'GrasClif',
                            12
                        ).scale.set(SCALE, SCALE);
                } else {
                    this.obstacles.push(new PIXI.Point(i, j));
                    play.game.add
                        .tileSprite(
                            i * SCALE * GROUND_SIZE,
                            j * SCALE * GROUND_SIZE,
                            GROUND_SIZE,
                            GROUND_SIZE,
                            'GrssMisc',
                            tileFrames[Math.floor(Math.random() * tileFrames.length)]
                        ).scale.set(SCALE, SCALE);
                }
            }
        }

    }

    isCellAccessible(position: PIXI.Point): boolean {
        if (position.x < 0 || position.x >= this.cellSize.x || position.y < 0 || position.y >= this.cellSize.y) {
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
