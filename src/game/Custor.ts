import {SCALE} from "./game_state/Play";
export class Cursor {
    private mouse: Phaser.Sprite;
    private green: Phaser.Sprite;
    private red: Phaser.Sprite;
    private mousePointer: Phaser.Pointer;

    constructor() {
    }

    create(game: Phaser.Game) {
        this.mousePointer = game.input.mousePointer;

        this.green = new Phaser.Sprite(game, 0, 0, 'Outline', 6);
        this.green.scale.setTo(SCALE, SCALE);
        this.green.anchor.setTo(0.5, 0.5);
        this.green.fixedToCamera = true;
        this.green.alpha = 0;
        game.add.existing(this.green);

        this.red = new Phaser.Sprite(game, 0, 0, 'Outline2', 6);
        this.red.scale.setTo(SCALE, SCALE);
        this.red.anchor.setTo(0.5, 0.5);
        this.red.fixedToCamera = true;
        this.red.alpha = 0;
        game.add.existing(this.red);

        this.mouse = new Phaser.Sprite(game, 0, 0, 'mouse', 6);
        this.mouse.scale.setTo(SCALE, SCALE);
        this.mouse.fixedToCamera = true;
        this.mouse.anchor.setTo(0, 0);
        game.add.existing(this.mouse);
    }

    update() {
        const position = new Phaser.Point(
            SCALE * Math.ceil(this.mousePointer.position.x / SCALE),
            SCALE * Math.ceil(this.mousePointer.position.y / SCALE)
        );
        this.green.cameraOffset = position;
        this.red.cameraOffset = position;
        this.mouse.cameraOffset = position;
    }
}
