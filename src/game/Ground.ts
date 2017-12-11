import Play, {SCALE} from "./state/Play";

export class Ground {

    constructor(play: Play)
    {
        const tileFrames = [18, 20, 32, 34, 36];
        for (let i = 0; i < play.game.width; i += SCALE * 20) {
            for (let j = 0; j < play.game.height; j += SCALE * 20) {
                if (Math.random() < 0.9) {
                    play.game.add
                        .tileSprite(i, j, 20, 20, 'GrasClif', 12)
                        .scale.set(SCALE, SCALE);
                } else {
                    play.game.add
                        .tileSprite(i, j, 20, 20, 'GrssMisc', tileFrames[Math.floor(Math.random() * tileFrames.length)])
                        .scale.set(SCALE, SCALE);
                }
            }
        }

    }
}
