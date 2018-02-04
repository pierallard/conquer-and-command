import {AbstractShootingBuildingSprite} from "./AbstractShootingBuildingSprite";
import {ROTATION} from "../computing/Rotation";
import {SCALE} from "../game_state/Play";

export class AdvancedGuardTowerSprite extends AbstractShootingBuildingSprite {
    constructor(game: Phaser.Game, groups: Phaser.Group[], x: number, y: number, key: string) {
        super(game, groups, x, y, key);
        this.loadTexture(this.key, 4);
        this.anchor.setTo(3 / 8, 5 / 6);
        this.lifeRectangle.setAnchor(3 / 8, 5 / 6);
        this.selectedRectangle.setAnchor(3 / 8, 5 / 6);
    }

    protected getShootSource(cellDest: PIXI.Point): PIXI.Point {
        let gap = new PIXI.Point(0, 0);
        switch (this.getRotation(cellDest)) {
            case ROTATION.TOP: gap.x = 41; gap.y = 6; break;
            case ROTATION.TOP_RIGHT: gap.x = 68; gap.y = 17; break;
            case ROTATION.RIGHT: gap.x = 76; gap.y = 26; break;
            case ROTATION.BOTTOM_RIGHT: gap.x = 68; gap.y = 53; break;
            case ROTATION.BOTTOM: gap.x = 40; gap.y = 67; break;
            case ROTATION.BOTTOM_LEFT: gap.x = 9; gap.y = 53; break;
            case ROTATION.LEFT: gap.x = 2; gap.y = 28; break;
            case ROTATION.TOP_LEFT: gap.x = 9; gap.y = 16; break;
        }

        const pixelsFromLeft = 80 * 3 / 8;
        const pixelsFromTop = 80 * 5 / 6;

        return new PIXI.Point(
            this.position.x - pixelsFromLeft * SCALE + gap.x * SCALE,
            this.position.y - pixelsFromTop * SCALE + gap.y * SCALE
        );
    }
}
