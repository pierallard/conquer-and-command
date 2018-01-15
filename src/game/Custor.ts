import {SCALE} from "./game_state/Play";
import {WorldKnowledge} from "./map/WorldKnowledge";
import {Unit} from "./unit/Unit";
import {Cell} from "./computing/Cell";
import {Player} from "./player/Player";
import {GAME_WIDTH} from "../app";
import {INTERFACE_WIDTH} from "./interface/UserInterface";

enum ACTION {
    DEFAULT,
    MOVE,
    ATTACK,
}

export class Cursor {
    private worldKnowledge: WorldKnowledge;
    private cursors: Phaser.Sprite[];
    private mousePointer: Phaser.Pointer;
    private camera: Phaser.Camera;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
        this.cursors = [];
    }

    create(game: Phaser.Game) {
        this.mousePointer = game.input.mousePointer;
        this.camera = game.camera;

        let green = new Phaser.Sprite(game, 0, 0, 'Outline', 6);
        green.scale.setTo(SCALE, SCALE);
        green.anchor.setTo(0.5, 0.5);
        green.fixedToCamera = true;
        game.add.existing(green);

        let red = new Phaser.Sprite(game, 0, 0, 'Outline2', 6);
        red.scale.setTo(SCALE, SCALE);
        red.anchor.setTo(0.5, 0.5);
        red.fixedToCamera = true;
        game.add.existing(red);

        let mouse = new Phaser.Sprite(game, 0, 0, 'mouse', 6);
        mouse.scale.setTo(SCALE, SCALE);
        mouse.fixedToCamera = true;
        mouse.anchor.setTo(0, 0);
        game.add.existing(mouse);

        this.cursors[ACTION.DEFAULT] = mouse;
        this.cursors[ACTION.MOVE] = green;
        this.cursors[ACTION.ATTACK] = red;

        this.showCursor(ACTION.DEFAULT);
    }

    update() {
        const position = new Phaser.Point(
            SCALE * Math.ceil(this.mousePointer.position.x / SCALE),
            SCALE * Math.ceil(this.mousePointer.position.y / SCALE)
        );
        this.cursors.forEach((cursor) => {
            cursor.cameraOffset = position;
        });

        this.showCursor(this.getAction());
    }

    private showCursor(selectedAction: ACTION) {
        Object.keys(this.cursors).forEach((action) => {
            this.cursors[action].alpha = (+action) === selectedAction ? 1 : 0;
        });
    }

    private getAction(): ACTION {
        if (this.mousePointer.x > GAME_WIDTH - INTERFACE_WIDTH) {
            return ACTION.DEFAULT;
        }
        if (!this.hasUnitSelected()) {
            return ACTION.DEFAULT;
        }
        
        const unitAt = this.worldKnowledge.getArmyAt(new PIXI.Point(
            Cell.realToCell(this.mousePointer.x + this.camera.position.x),
            Cell.realToCell(this.mousePointer.y + this.camera.position.y)
        ));
        if (unitAt && unitAt.getPlayer() !== this.player) {
            return ACTION.ATTACK;
        } else {
            return ACTION.MOVE;
        }
    }

    private hasUnitSelected() {
        const selecteds = this.worldKnowledge.getSelectedArmies();
        for (let i = 0; i < selecteds.length; i++) {
            if (selecteds[i] instanceof Unit) {
                return true;
            }
        }

        return false;
    }
}
