import Play, {CIRCLE_RADIUS, SCALE} from "../game_state/Play";
import {UnitRepository} from "../repository/UnitRepository";

export enum Rotation {
    TOP = 1,
    TOP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT
}

export class MovedSprite extends Phaser.Sprite
{
    private displayLife: boolean = true;
    protected vector: Phaser.Point = null;
    protected spriteKey: string;
    protected lifeRectangle: Phaser.Graphics;
    protected maxLife: number = 100;
    protected life: number = 100;
    private weight: number;
    protected unitRepository: UnitRepository;
    private shootEnabled: boolean = true;
    private selectedRectable: Phaser.Graphics = null;

    constructor(unitRepository: UnitRepository, x: number, y: number, spriteKey: string, weight: number) {
        super(unitRepository.play_.game, x, y, spriteKey);

        this.unitRepository = unitRepository;
        this.spriteKey = spriteKey;
        this.weight = weight;

        this.lifeRectangle = this.game.add.graphics(0, 0);
        this.lifeRectangle.beginFill(0x00ff00);
        this.lifeRectangle.drawRect(-CIRCLE_RADIUS/SCALE/2, CIRCLE_RADIUS/SCALE/2, CIRCLE_RADIUS/SCALE, 2);
        if (this.displayLife) {
            this.addChild(this.lifeRectangle);
        }

        this.scale.setTo(SCALE);
        this.anchor.setTo(0.5, 0.5);
        this.game.add.existing(this);

        // To be more realistic
        this.shootEnabled = false;
        this.unitRepository.play_.game.time.events.add(Math.random() * 4 * Phaser.Timer.SECOND, () => {
            this.shootEnabled = true;
        }, this);
    }

    public getRotation(vector: PIXI.Point): Rotation
    {
        if (null === vector) {
            return Rotation.TOP_LEFT;
        }

        const angle = Math.atan2(vector.y, vector.x);
        if (angle > Math.PI/8 * 7) {
            return Rotation.LEFT;
        }
        if (angle > Math.PI/8 * 5) {
            return Rotation.BOTTOM_LEFT;
        }
        if (angle > Math.PI/8 * 3) {
            return Rotation.BOTTOM;
        }
        if (angle > Math.PI/8) {
            return Rotation.BOTTOM_RIGHT;
        }
        if (angle > Math.PI/8 * -1) {
            return Rotation.RIGHT;
        }
        if (angle > Math.PI/8 * -3) {
            return Rotation.TOP_RIGHT;
        }
        if (angle > Math.PI/8 * -5) {
            return Rotation.TOP;
        }
        if (angle > Math.PI/8 * -7) {
            return Rotation.TOP_LEFT;
        }

        return Rotation.LEFT;
    }

    public loadRotation(rotation: Rotation)
    {
        switch(rotation) {
            case Rotation.TOP: this.loadTexture(this.spriteKey, 1); break;
            case Rotation.TOP_RIGHT: this.loadTexture(this.spriteKey, 2); break;
            case Rotation.RIGHT: this.loadTexture(this.spriteKey, 5); break;
            case Rotation.BOTTOM_RIGHT: this.loadTexture(this.spriteKey, 8); break;
            case Rotation.BOTTOM: this.loadTexture(this.spriteKey, 7); break;
            case Rotation.BOTTOM_LEFT: this.loadTexture(this.spriteKey, 6); break;
            case Rotation.LEFT: this.loadTexture(this.spriteKey, 3); break;
            case Rotation.TOP_LEFT: this.loadTexture(this.spriteKey, 0); break;
        }
    }

    setSelected(value: boolean) {
        if (value) {
            if (null === this.selectedRectable) {
                this.selectedRectable = this.game.add.graphics(0, 0);
                this.selectedRectable.lineStyle(1, 0x00ff00, 0.5);
                this.selectedRectable.drawRect(-CIRCLE_RADIUS / SCALE / 2, -CIRCLE_RADIUS / SCALE / 2, CIRCLE_RADIUS / SCALE, CIRCLE_RADIUS / SCALE);
                this.addChild(this.selectedRectable);
            }
        } else if (this.selectedRectable !== null) {
            this.selectedRectable.destroy();
            this.selectedRectable = null;
        }
    }

    isSelected() {
        return this.selectedRectable !== null;
    }
}
