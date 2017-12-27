import {WorldKnowledge} from "./WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {GROUND_HEIGHT, GROUND_WIDTH} from "./GeneratedGround";

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

        let data = this.worldKnowledge.getGroundCSV();

        game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
        let map = game.add.tilemap('dynamicMap', 20, 20, GROUND_WIDTH, GROUND_HEIGHT);
        map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 0, 0);
        map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 0, 100);
        map.addTilesetImage('Ice2Snow', 'Ice2Snow', 20, 20, 0, 0, 200);
        map.addTilesetImage('Snow', 'Snow', 20, 20, 0, 0, 300);
        map.addTilesetImage('Snw2Crtb', 'Snw2Crtb', 20, 20, 0, 0, 400);
        map.addTilesetImage('IceBrk2', 'IceBrk2', 20, 20, 0, 0, 500);
        map.addTilesetImage('Grs2Watr', 'Grs2Watr', 20, 20, 0, 0, 600);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', 20, 20, 0, 0, 700);
        map.addTilesetImage('Snw2Mnt', 'Snw2Mnt', 20, 20, 0, 0, 800);
        map.addTilesetImage('Stn2SnwB', 'Stn2SnwB', 20, 20, 0, 0, 900);
        this.layer = map.createLayer(0, 1000000, 100000);

        let scale = SIZE / Math.max(map.widthInPixels, map.heightInPixels) * 2;
        this.layer.scale.setTo(scale, scale);
        this.layer.fixedToCamera = true;
        this.layer.cameraOffset.setTo(X * 2, Y * 2);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;
        game.camera.bounds.setTo(
            0,
            0,
            this.worldKnowledge.getGroundWidth(),
            this.worldKnowledge.getGroundHeight()
        );

        this.layer.resizeWorld();

        game.add.existing(this.layer);

        let scale2 = SIZE / Math.max(map.width, map.height) * SCALE;
        this.graphics = new Phaser.Graphics(game);
        this.graphics.scale.set(scale2, scale2);
        this.graphics.position.setTo(X * 2, Y * 2);
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
