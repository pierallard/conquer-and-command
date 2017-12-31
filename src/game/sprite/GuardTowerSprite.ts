import {BuildingSprite} from "./BuildingSprite";
import {Cell} from "../computing/Cell";
import {Rotation, ROTATION} from "../computing/Rotation";
import {Shoot} from "./Shoot";

export class GuardTowerSprite extends BuildingSprite {
    constructor(game: Phaser.Game, group: Phaser.Group, x: number, y: number, key: string) {
        super(game, group, x, y, key);
        this.group = group;
        this.anchor.setTo(1 / 4, 3 / 4);
    }

    doShoot(cellPosition: PIXI.Point) {
        this.rotateTowards(cellPosition);
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellPosition.x - Cell.realToCell(this.x),
            cellPosition.y - Cell.realToCell(this.y)
        ));
        this.group.add(new Shoot(this.game, this.x, this.y, rotation));
    }

    private rotateTowards(cellPosition: PIXI.Point) {
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellPosition.x - Cell.realToCell(this.x),
            cellPosition.y - Cell.realToCell(this.y)
        ));
        this.loadRotation(rotation);
    }

    private loadRotation(rotation: ROTATION) {
        switch (rotation) {
            case ROTATION.TOP: this.loadTexture(this.key, 0); break;
            case ROTATION.TOP_RIGHT: this.loadTexture(this.key, 1); break;
            case ROTATION.RIGHT: this.loadTexture(this.key, 2); break;
            case ROTATION.BOTTOM_RIGHT: this.loadTexture(this.key, 3); break;
            case ROTATION.BOTTOM: this.loadTexture(this.key, 4); break;
            case ROTATION.BOTTOM_LEFT: this.loadTexture(this.key, 5); break;
            case ROTATION.LEFT: this.loadTexture(this.key, 6); break;
            case ROTATION.TOP_LEFT: this.loadTexture(this.key, 7); break;
        }
    }
}
