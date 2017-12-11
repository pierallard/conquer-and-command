import {MovedSprite} from "./MovedSprite";
import {GoaledSprite} from "./GoaledSprite";
import {UnitRepository} from "../repository/UnitRepository";

export class BlockedSprite extends MovedSprite
{
    constructor(unitRepository: UnitRepository, x: number, y: number) {
        super(unitRepository, x, y, 'Tank12', 0);
    }

    protected isEnnemy(sprite: MovedSprite) {
        return sprite instanceof GoaledSprite;
    }
}
