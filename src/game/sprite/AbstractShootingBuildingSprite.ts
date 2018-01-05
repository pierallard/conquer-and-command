import {BuildingSprite} from "./BuildingSprite";
import {Rotation, ROTATION} from "../computing/Rotation";
import {Cell} from "../computing/Cell";
import {Rocket} from "../shoot/Rocket";

export abstract class AbstractShootingBuildingSprite extends BuildingSprite {
    doShoot(closestEnemyPosition: PIXI.Point) {
        this.rotateTowards(closestEnemyPosition);

        new Rocket(this.effectsGroup, this.getShootSource(closestEnemyPosition), new PIXI.Point(
            Cell.cellToReal(closestEnemyPosition.x),
            Cell.cellToReal(closestEnemyPosition.y)
        ));
    }

    protected getShootSource(cellDest: PIXI.Point): PIXI.Point {
        return this.position;
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
