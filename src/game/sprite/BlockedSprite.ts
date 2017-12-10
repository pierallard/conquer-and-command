import {MovedSprite} from "./MovedSprite";
import Play from "../state/Play";
import {GoaledSprite} from "./GoaledSprite";

export class BlockedSprite extends MovedSprite
{
    constructor(play: Play, x: number, y: number) {
        super(play, x, y, 'Tank12', 0);
    }

    protected isEnnemy(sprite: MovedSprite) {
        return sprite instanceof GoaledSprite;
    }
}
