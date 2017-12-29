import {ConstructableBuilding} from "./ConstructableBuilding";
import {Cell} from "../computing/Cell";
import {SCALE} from "../game_state/Play";

export class ConcreteBarrier extends ConstructableBuilding {
    private topLeftSprite: Phaser.Sprite;
    private topRightSprite: Phaser.Sprite;
    private bottomRightSprite: Phaser.Sprite;
    private bottomLeftSprite: Phaser.Sprite;

    create(game: Phaser.Game, group: Phaser.Group) {
        const positionX = Cell.cellToReal(this.cellPosition.x);
        const positionY = Cell.cellToReal(this.cellPosition.y);
        this.topLeftSprite = new Phaser.Sprite(game, positionX, positionY, 'Wall', 0);
        this.topLeftSprite.anchor.setTo(1, 1);
        this.topRightSprite = new Phaser.Sprite(game, positionX, positionY, 'Wall', 4);
        this.topRightSprite.anchor.setTo(0, 1);
        this.bottomRightSprite = new Phaser.Sprite(game, positionX, positionY, 'Wall', 30);
        this.bottomRightSprite.anchor.setTo(0, 0.5);
        this.bottomLeftSprite = new Phaser.Sprite(game, positionX, positionY, 'Wall', 26);
        this.bottomLeftSprite.anchor.setTo(1, 0.5);

        this.getSprites().forEach((sprite) => {
            sprite.scale.setTo(SCALE / 2, SCALE / 2); // Wall texture should be resized by 50%
            group.add(sprite);
        });
    }

    private getSprites(): Phaser.Sprite[] {
        return [
            this.topLeftSprite,
            this.topRightSprite,
            this.bottomRightSprite,
            this.bottomLeftSprite,
        ];
    }
}
