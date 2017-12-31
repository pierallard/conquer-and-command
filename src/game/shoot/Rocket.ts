import {Rotation, ROTATION} from "../computing/Rotation";
import {SCALE} from "../game_state/Play";
import {Explosion} from "../sprite/Explosion";
import {Distance} from "../computing/Distance";

export class Rocket extends Phaser.Sprite {
    private static getRocketFrame(rotation: ROTATION) {
        switch (rotation) {
            case ROTATION.TOP: return 10;
            case ROTATION.TOP_RIGHT: return 11;
            case ROTATION.RIGHT: return 23;
            case ROTATION.BOTTOM_RIGHT: return 35;
            case ROTATION.BOTTOM: return 34;
            case ROTATION.BOTTOM_LEFT: return 33;
            case ROTATION.LEFT: return 21;
            case ROTATION.TOP_LEFT: return 9;
        }
    }

    constructor(group: Phaser.Group, source: PIXI.Point, dest: PIXI.Point) {
        const rotation = Rotation.getRotation(new Phaser.Point(dest.x - source.x, dest.y - source.y));
        super(group.game, source.x, source.y, 'Bullets', Rocket.getRocketFrame(rotation));

        this.anchor.setTo(0.5, 0.5);
        this.scale.setTo(SCALE * 1.5, SCALE * 1.5);
        group.add(this);

        this.game.add.tween(this).to({
            x: dest.x,
            y: dest.y,
        }, Distance.to(source, dest) * 4, Phaser.Easing.Default, true).onComplete.add(() => {
            let explosion = new Explosion(this.game, dest.x, dest.y);
            group.add(explosion);
            this.destroy(true);
        });
    }
}
