import {IMAGE_FORMAT, UnitSprite} from "./UnitSprite";
import {ROTATION} from "../computing/Rotation";
import {SelectRectangle} from "./SelectRectangle";
import {LifeRectangle} from "./LifeRectangle";
import {GROUP, SCALE} from "../game_state/Play";
import {ShotCounter} from "./ShotCounter";
import {Cell} from "../computing/Cell";
import {UNLAND_TIME} from "../unit/Orca";

const ANIM_SPEED = 30;
const GAP_X = 20;
const GAP_Y = 50;

export class OrcaSprite extends UnitSprite {
    private anims: Phaser.Animation[];
    private shadow: OrcaSpriteShadow;
    private shotCounter: ShotCounter;
    private isLanded: boolean;

    constructor(game: Phaser.Game, groups: Phaser.Group[], cellPosition: PIXI.Point, counter: number) {
        super(game, groups, cellPosition, 'Copter', IMAGE_FORMAT.ANIMATED);

        groups[GROUP.AERIAL].add(this);

        this.selectedRectangle = new SelectRectangle(game, 20, this.height / SCALE);
        this.addChild(this.selectedRectangle);

        this.lifeRectangle = new LifeRectangle(game, 20, this.height / SCALE);
        this.addChild(this.lifeRectangle);

        this.shotCounter = new ShotCounter(game, counter);
        this.addChild(this.shotCounter);

        this.anims = [];
        for (let i = 0; i < 8; i++) {
            this.anims.push(this.animations.add(
                'toto',
                [i, 8 + i, 16 + i, 24 + i]
            ));
        }

        this.shadow = new OrcaSpriteShadow(game, this.x + GAP_X, this.y + GAP_Y);
        groups[GROUP.SHADOW].add(this.shadow);

        this.loadRotation(ROTATION.RIGHT);

        this.isLanded = false;
    }

    update() {
        super.update();
        if (!this.isLanded) {
            this.shadow.x = this.x + GAP_X;
            this.shadow.y = this.y + GAP_Y;
        }
    }

    doDestroy() {
        super.doDestroy();
        this.shadow.destroy(true);
    }

    setSelected(value: boolean = true) {
        this.shotCounter.setVisible(value);

        super.setSelected(value);
    }

    updateCounter(value: number) {
        this.shotCounter.updateCounter(value);
    }

    landIfNeeded() {
        if (!this.isLanded) {
            this.land();
        }
    }

    unlandIfNeeded() {
        if (this.isLanded) {
            this.unland();
        }
    }

    protected loadRotation(rotation: ROTATION) {
        this.anims[rotation].play(ANIM_SPEED, true, false);
        this.shadow.loadRotation(rotation);
    }

    private land() {
        this.isLanded = true;
        this.shadow.land();
    }

    private unland() {
        this.isLanded = false;
        this.shadow.unland(this.position);
    }
}

class OrcaSpriteShadow extends Phaser.Sprite {
    anims: Phaser.Animation[];

    constructor(game: Phaser.Game, x, y) {
        super(game, x, y, 'CptrShd1');

        this.scale.setTo(SCALE, SCALE);
        this.anchor.setTo(0.5, 0.5);

        this.anims = [];
        for (let i = 0; i < 8; i++) {
            this.anims.push(this.animations.add(
                'toto',
                [i, 8 + i, 16 + i, 24 + i]
            ));
        }

        this.alpha = 0.5;

        this.loadRotation(ROTATION.RIGHT);
    }

    loadRotation(rotation: ROTATION) {
        this.anims[rotation].play(ANIM_SPEED, true, false);
    }

    land() {
        const goalX = this.x - GAP_X;
        const goalY = this.y - GAP_Y;
        this.game.add.tween(this).to({
            x: goalX,
            y: goalY,
        }, UNLAND_TIME * Phaser.Timer.SECOND, Phaser.Easing.Power0, true);
    }

    unland(position: PIXI.Point) {
        const goalX = position.x + GAP_X;
        const goalY = position.y + GAP_Y;
        this.game.add.tween(this).to({
            x: goalX,
            y: goalY,
        }, UNLAND_TIME * Phaser.Timer.SECOND, Phaser.Easing.Power0, true);
    }
}
