import Play, {SCALE} from "./state/Play";

export const GROUND_SIZE = 20;

export class Ground {
    private obstacles: Phaser.Point[];

    constructor(play: Play)
    {
        this.obstacles = [];
        const tileFrames = [18, 20, 32, 34, 36];
        for (let i = 0; i < play.game.width; i += SCALE * GROUND_SIZE) {
            for (let j = 0; j < play.game.height; j += SCALE * GROUND_SIZE) {
                if (Math.random() < 0.7) {
                    play.game.add
                        .tileSprite(i, j, GROUND_SIZE, GROUND_SIZE, 'GrasClif', 12)
                        .scale.set(SCALE, SCALE);
                } else {
                    this.obstacles.push(
                        new Phaser.Point(i / (SCALE * GROUND_SIZE), j / (SCALE * GROUND_SIZE))
                    );
                    play.game.add
                        .tileSprite(i, j, GROUND_SIZE, GROUND_SIZE, 'GrssMisc', tileFrames[Math.floor(Math.random() * tileFrames.length)])
                        .scale.set(SCALE, SCALE);
                }
            }
        }

    }

    isAccessible(position: Phaser.Point): boolean {
        if (position.x === 13 && position.y > 3 && position.y < 10) {
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
