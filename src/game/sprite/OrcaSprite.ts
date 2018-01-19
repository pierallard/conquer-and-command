import {IMAGE_FORMAT, UnitSprite} from "./UnitSprite";
import {ROTATION} from "../computing/Rotation";
import {SelectRectangle} from "./SelectRectangle";
import {LifeRectangle} from "./LifeRectangle";
import {GROUP, SCALE} from "../game_state/Play";

export class OrcaSprite extends UnitSprite {
    anims: Phaser.Animation[];
    shadow: OrcaSpriteShadow;

    constructor(game: Phaser.Game, groups: Phaser.Group[], cellPosition: PIXI.Point) {
        super(game, groups, cellPosition, 'Copter', IMAGE_FORMAT.ANIMATED);

        this.selectedRectangle = new SelectRectangle(game, 20, this.height / SCALE);
        this.addChild(this.selectedRectangle);

        this.lifeRectangle = new LifeRectangle(game, 20, this.height / SCALE);
        this.addChild(this.lifeRectangle);

        this.anims = [];
        for (let i = 0; i < 8; i++) {
            this.anims.push(this.animations.add(
                'toto',
                [i, 8 + i, 16 + i, 24 + i]
            ));
        }

        this.loadRotation(ROTATION.RIGHT);

        this.shadow = new OrcaSpriteShadow(game, this.x + 20, this.y + 50);
        groups[GROUP.SHADOW].add(this.shadow);
    }

    update() {
        super.update();
        this.shadow.x = this.x + 20;
        this.shadow.y = this.y + 50;
    }

    protected loadRotation(rotation: ROTATION) {
        this.anims[rotation].play(50, true, false);
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

        this.loadRotation(ROTATION.RIGHT);
    }

    update() {

    }

    protected loadRotation(rotation: ROTATION) {
        this.anims[rotation].play(50, true, false);
    }
}
