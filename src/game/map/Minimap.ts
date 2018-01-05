import {WorldKnowledge} from "./WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {GROUND_HEIGHT, GROUND_WIDTH} from "./GeneratedGround";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {GROUND_SIZE} from "./Ground";

const SIZE = 60;
const X = 571;
const Y = 9;
const REFRESH_TIME = 0.25 * Phaser.Timer.SECOND;
const TILE_SIZE = 20;
const IDONTKNOW = 1;

export class MiniMap {
    private graphics: Phaser.Graphics;
    private worldKnowledge: WorldKnowledge;
    private hasRenderedRecently: boolean = false;
    private layer: Phaser.TilemapLayer;
    private timerEvents: Phaser.Timer;

    constructor(worldKnowledge: WorldKnowledge) {
        this.worldKnowledge = worldKnowledge;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.timerEvents = game.time.events;

        let data = this.worldKnowledge.getGroundCSV();

        game.cache.addTilemap('minimap', null, data, Phaser.Tilemap.CSV);
        let map = game.add.tilemap('minimap', IDONTKNOW, IDONTKNOW, GROUND_WIDTH * 2, GROUND_HEIGHT * 2);
        map.addTilesetImage('GrasClif', 'GrasClif', TILE_SIZE, TILE_SIZE, 0, 0, 0);
        map.addTilesetImage('GrssMisc', 'GrssMisc', TILE_SIZE, TILE_SIZE, 0, 0, 100);
        map.addTilesetImage('Ice2Snow', 'Ice2Snow', TILE_SIZE, TILE_SIZE, 0, 0, 200);
        map.addTilesetImage('Snow', 'Snow', TILE_SIZE, TILE_SIZE, 0, 0, 300);
        map.addTilesetImage('Snw2Crtb', 'Snw2Crtb', TILE_SIZE, TILE_SIZE, 0, 0, 400);
        map.addTilesetImage('IceBrk2', 'IceBrk2', TILE_SIZE, TILE_SIZE, 0, 0, 500);
        map.addTilesetImage('Grs2Watr', 'Grs2Watr', TILE_SIZE, TILE_SIZE, 0, 0, 600);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', TILE_SIZE, TILE_SIZE, 0, 0, 700);
        map.addTilesetImage('Snw2Mnt', 'Snw2Mnt', TILE_SIZE, TILE_SIZE, 0, 0, 800);
        map.addTilesetImage('Stn2SnwB', 'Stn2SnwB', TILE_SIZE, TILE_SIZE, 0, 0, 900);
        this.layer = map.createLayer(0, GROUND_WIDTH * IDONTKNOW, GROUND_HEIGHT * IDONTKNOW, group);

        let scale = SIZE / Math.max(map.widthInPixels, map.heightInPixels) * 2;
        this.layer.scale.setTo(scale, scale);
        this.layer.fixedToCamera = false;
        this.layer.position.setTo(X * 2, Y * 2);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;

        this.graphics = new Phaser.Graphics(game);
        this.graphics.position.setTo(X * 2, Y * 2);
        this.graphics.fixedToCamera = true;
        game.add.existing(this.graphics);
    }

    update() {
        if (this.hasRenderedRecently) {
            return;
        }
        const cameraView = this.layer.game.camera.view;
        const scale = SIZE / Math.max(GROUND_WIDTH, GROUND_HEIGHT) * SCALE;
        const scaleCamera = SIZE / Math.max(GROUND_WIDTH, GROUND_HEIGHT) / GROUND_SIZE;

        this.graphics.clear();

        this.worldKnowledge.getUnits().forEach((unit) => {
            this.graphics.beginFill(unit.getPlayer().getColor());
            this.graphics.lineStyle(1, unit.getPlayer().getColor());
            unit.getCellPositions().forEach((cellPosition) => {
                this.graphics.drawRect(cellPosition.x * scale, cellPosition.y * scale, 1, 1);
            });
        });

        this.worldKnowledge.getBuildings().forEach((building) => {
            if (building.getPlayer()) {
                this.graphics.beginFill(building.getPlayer().getColor());
                this.graphics.lineStyle(1, building.getPlayer().getColor());
                building.getCellPositions().forEach((cellPosition) => {
                    this.graphics.drawRect(cellPosition.x * scale, cellPosition.y * scale, 1, 1);
                });
            }
        });

        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.endFill();
        this.graphics.drawRect(
            cameraView.x * scaleCamera,
            cameraView.y * scaleCamera,
            (cameraView.width - INTERFACE_WIDTH) * scaleCamera,
            cameraView.height * scaleCamera
        );

        this.hasRenderedRecently = true;
        this.timerEvents.add(REFRESH_TIME, () => {
            this.hasRenderedRecently = false;
        }, this);
    }
}
