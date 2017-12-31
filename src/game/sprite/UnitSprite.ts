import {SCALE} from "../game_state/Play";
import {Explosion} from "./Explosion";
import {Shoot} from "./Shoot";
import {Cell} from "../computing/Cell";
import {SelectRectangle} from "./SelectRectangle";
import {LifeRectangle} from "./LifeRectangle";
import {ROTATION, Rotation} from "../computing/Rotation";

export enum IMAGE_FORMAT {
    THREE,
    FIVE,
    NINE,
}

export class UnitSprite extends Phaser.Sprite {
    private lifeRectangle: LifeRectangle;
    private selectedRectable: SelectRectangle;
    private group: Phaser.Group;
    private imageFormat: IMAGE_FORMAT;

    constructor(
        game: Phaser.Game,
        group: Phaser.Group,
        cellPosition: PIXI.Point,
        key: string,
        imageFormat = IMAGE_FORMAT.THREE
    ) {
        super(game, Cell.cellToReal(cellPosition.x), Cell.cellToReal(cellPosition.y), key);

        this.imageFormat = imageFormat;

        this.group = group;
        this.group.add(this);

        this.scale.setTo(SCALE, SCALE);
        this.anchor.setTo(0.5, 0.5);

        this.selectedRectable = new SelectRectangle(game, this.width / SCALE, this.height / SCALE);
        this.addChild(this.selectedRectable);

        this.lifeRectangle = new LifeRectangle(game, this.width / SCALE, this.height / SCALE);
        this.addChild(this.lifeRectangle);

        group.add(this);
    }

    doDestroy() {
        this.doExplodeEffect();
        this.destroy(true);
    }

    doShoot(cellPosition: PIXI.Point) {
        this.rotateTowards(cellPosition);
        this.doShootEffect(cellPosition);
    }

    updateLife(life: number, maxLife: number) {
        this.lifeRectangle.updateLife(life / maxLife);
    }

    doMove(cellPosition: PIXI.Point, duration: number) {
        this.rotateTowards(cellPosition);
        this.game.add.tween(this).to({
            x: Cell.cellToReal(cellPosition.x),
            y: Cell.cellToReal(cellPosition.y),
        }, duration, Phaser.Easing.Default, true);
    }

    doLoad(cellPosition: PIXI.Point) {
        this.rotateTowards(cellPosition);
    }

    setSelected(value: boolean = true) {
        this.selectedRectable.setVisible(value);
        this.lifeRectangle.setVisible(value);
    }

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return this.x + this.width / 2 > left &&
            this.x - this.width / 2 < right &&
            this.y + this.height / 2 > top &&
            this.y - this.height / 2 < bottom;
    }

    private rotateTowards(cellPosition: PIXI.Point): void {
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellPosition.x - Cell.realToCell(this.x),
            cellPosition.y - Cell.realToCell(this.y)
        ));
        this.loadRotation(rotation);
    }

    private doExplodeEffect() {
        this.group.add(new Explosion(this.game, this.x, this.y));
    }

    private doShootEffect(cellPosition: PIXI.Point) {
        const rotation = Rotation.getRotation(new Phaser.Point(
            cellPosition.x - Cell.realToCell(this.x),
            cellPosition.y - Cell.realToCell(this.y)
        ));
        this.group.add(new Shoot(this.game, this.x, this.y, rotation));
    }

    private loadRotation(rotation: ROTATION) {
        if (this.imageFormat === IMAGE_FORMAT.THREE) {
            switch (rotation) {
                case ROTATION.TOP: this.loadTexture(this.key, 1); break;
                case ROTATION.TOP_RIGHT: this.loadTexture(this.key, 2); break;
                case ROTATION.RIGHT: this.loadTexture(this.key, 5); break;
                case ROTATION.BOTTOM_RIGHT: this.loadTexture(this.key, 8); break;
                case ROTATION.BOTTOM: this.loadTexture(this.key, 7); break;
                case ROTATION.BOTTOM_LEFT: this.loadTexture(this.key, 6); break;
                case ROTATION.LEFT: this.loadTexture(this.key, 3); break;
                case ROTATION.TOP_LEFT: this.loadTexture(this.key, 0); break;
            }
        } else if (this.imageFormat === IMAGE_FORMAT.FIVE) {
            switch (rotation) {
                case ROTATION.TOP: this.loadTexture(this.key, 2); break;
                case ROTATION.TOP_RIGHT: this.loadTexture(this.key, 4); break;
                case ROTATION.RIGHT: this.loadTexture(this.key, 14); break;
                case ROTATION.BOTTOM_RIGHT: this.loadTexture(this.key, 24); break;
                case ROTATION.BOTTOM: this.loadTexture(this.key, 22); break;
                case ROTATION.BOTTOM_LEFT: this.loadTexture(this.key, 20); break;
                case ROTATION.LEFT: this.loadTexture(this.key, 10); break;
                case ROTATION.TOP_LEFT: this.loadTexture(this.key, 0); break;
            }
        } else {
            switch (rotation) {
                case ROTATION.TOP: this.loadTexture(this.key, 8); break;
                case ROTATION.TOP_RIGHT: this.loadTexture(this.key, 6); break;
                case ROTATION.RIGHT: this.loadTexture(this.key, 4); break;
                case ROTATION.BOTTOM_RIGHT: this.loadTexture(this.key, 2); break;
                case ROTATION.BOTTOM: this.loadTexture(this.key, 0); break;
                case ROTATION.BOTTOM_LEFT: this.loadTexture(this.key, 14); break;
                case ROTATION.LEFT: this.loadTexture(this.key, 12); break;
                case ROTATION.TOP_LEFT: this.loadTexture(this.key, 10); break;
            }
        }
    }
}
