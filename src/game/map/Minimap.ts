import {WorldKnowledge} from "./WorldKnowledge";
import {SCALE} from "../game_state/Play";

const SIZE = 60;
const X = 571;
const Y = 9;
const REFRESH_TIME = 0.5 * Phaser.Timer.SECOND;

export class Minimap {
    private graphics: Phaser.Graphics;
    private worldKnowledge: WorldKnowledge;
    private hasRenderedRecently: boolean = false;
    private layer: Phaser.TilemapLayer;
    private timerEvents: Phaser.Timer;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game) {
        this.timerEvents = game.time.events;

        let map = new Phaser.Tilemap(game, 'basicmap');
        map.addTilesetImage('GrasClif', 'GrasClif');
        map.addTilesetImage('GrssMisc', 'GrssMisc');
        this.layer = map.createLayer('layer');
        let scale = SIZE / Math.max(map.widthInPixels, map.heightInPixels) * SCALE;
        this.layer.scale.setTo(scale, scale);
        this.layer.fixedToCamera = true;
        this.layer.cameraOffset.setTo(X * SCALE, Y * SCALE);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;
        game.add.existing(this.layer);

        let scale2 = SIZE / Math.max(map.width, map.height) * SCALE;
        this.graphics = new Phaser.Graphics(game);
        this.graphics.scale.set(scale2, scale2);
        this.graphics.position.setTo(X * SCALE, Y * SCALE);
        this.graphics.fixedToCamera = true;
        game.add.existing(this.graphics);
    }

    update() {
        if (this.hasRenderedRecently) {
            return;
        }

        this.graphics.clear();
        this.worldKnowledge.getUnits().forEach((unit) => {
            this.graphics.beginFill(unit.getPlayer().getColor());
            unit.getCellPositions().forEach((cellPosition) => {
                this.graphics.drawRect(cellPosition.x, cellPosition.y, 1, 1);
            });
        });

        this.hasRenderedRecently = true;
        this.timerEvents.add(REFRESH_TIME, () => {
            this.hasRenderedRecently = false;
        }, this);
    }
}
