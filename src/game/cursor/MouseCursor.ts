import {SCALE} from "../game_state/Play";

export enum ACTION {
    DEFAULT,
    MOVE,
    ATTACK,
    SPECIAL,
}

export class MouseCursor {
    protected cursors: Phaser.Sprite[];
    protected mousePointer: Phaser.Pointer;
    protected camera: Phaser.Camera;

    constructor() {
        this.cursors = [];
    }

    create(game: Phaser.Game) {
        this.mousePointer = game.input.mousePointer;
        this.camera = game.camera;

        let mouse = new Phaser.Sprite(game, 0, 0, 'mouse', 6);
        mouse.scale.setTo(SCALE, SCALE);
        mouse.fixedToCamera = true;
        mouse.anchor.setTo(0, 0);
        game.add.existing(mouse);

        this.cursors[ACTION.DEFAULT] = mouse;
    }

    update() {
        const position = new Phaser.Point(
            SCALE * Math.ceil(this.mousePointer.position.x / SCALE),
            SCALE * Math.ceil(this.mousePointer.position.y / SCALE)
        );
        this.cursors.forEach((cursor) => {
            cursor.cameraOffset = position;
        });
    }
}
