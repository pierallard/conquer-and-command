import {IMAGE_FORMAT, UnitSprite} from "./UnitSprite";
import {ROTATION} from "../computing/Rotation";
import {SelectRectangle} from "./SelectRectangle";
import {LifeRectangle} from "./LifeRectangle";
import {SCALE} from "../game_state/Play";

export class OrcaSprite extends UnitSprite {
    anims: Phaser.Animation[];

    constructor(game: Phaser.Game, group: Phaser.Group, cellPosition: PIXI.Point) {
        super(game, group, cellPosition, 'Copter', IMAGE_FORMAT.ANIMATED);

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
    }

    protected loadRotation(rotation: ROTATION) {
        this.anims[rotation].play(50, true, false);
    }
}
