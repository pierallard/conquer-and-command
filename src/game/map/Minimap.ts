import {WorldKnowledge} from "./WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {GROUND_HEIGHT, GROUND_WIDTH} from "./GeneratedGround";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {GROUND_SIZE} from "./Ground";
import {Player} from "../player/Player";

const SIZE = 60;
const X = 571;
const Y = 9;
const REFRESH_TIME = 0.25 * Phaser.Timer.SECOND;
const TILE_SIZE = 20;
const IDONTKNOW = 1;

export class MiniMap {
    private unitAndBuildingGraphics: Phaser.Graphics;
    private fogGraphics: Phaser.Graphics;
    private rectGraphics: Phaser.Graphics;
    private worldKnowledge: WorldKnowledge;
    private hasRenderedRecently: boolean = false;
    private layer: Phaser.TilemapLayer;
    private timerEvents: Phaser.Timer;
    private scale: number;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
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

        this.scale = SIZE / Math.max(GROUND_WIDTH, GROUND_HEIGHT) * SCALE;
        this.layer.scale.setTo(this.scale, this.scale);
        this.layer.fixedToCamera = false;
        this.layer.position.setTo(X * SCALE, Y * SCALE);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;

        const secondScale = SIZE * SCALE / Math.max(GROUND_WIDTH, GROUND_HEIGHT);
        this.unitAndBuildingGraphics = new Phaser.Graphics(game);
        this.unitAndBuildingGraphics.position.setTo(X * SCALE, Y * SCALE);
        this.unitAndBuildingGraphics.fixedToCamera = true;
        this.unitAndBuildingGraphics.scale.set(secondScale, secondScale);
        game.add.existing(this.unitAndBuildingGraphics);

        this.fogGraphics = new Phaser.Graphics(game);
        this.fogGraphics.position.setTo(X * SCALE, Y * SCALE);
        this.fogGraphics.fixedToCamera = true;
        this.fogGraphics.scale.set(secondScale, secondScale);
        game.add.existing(this.fogGraphics);

        this.rectGraphics = new Phaser.Graphics(game);
        this.rectGraphics.position.setTo(X * SCALE, Y * SCALE);
        this.rectGraphics.fixedToCamera = true;
        game.add.existing(this.rectGraphics);

        this.layer.inputEnabled = true;
        this.layer.events.onInputDown.add(() => {
            const scaleCamera = this.scale / SCALE / GROUND_SIZE;
            const cameraView = this.layer.game.camera.view;
            const cameraWidth = (cameraView.width - INTERFACE_WIDTH) * scaleCamera;
            const cameraHeight = cameraView.height * scaleCamera;
            const x = (game.input.mousePointer.x - X * SCALE - cameraWidth / 2) / this.scale * GROUND_SIZE * SCALE;
            const y = (game.input.mousePointer.y - Y * SCALE - cameraHeight / 2) / this.scale * GROUND_SIZE * SCALE;
            game.camera.setPosition(x, y);
        });
    }

    update() {
        if (this.hasRenderedRecently) {
            return;
        }

        this.updateUnitAndBuildingGraphics();
        this.updateFogGraphics();
        this.udpateRectGraphics();

        this.hasRenderedRecently = true;
        this.timerEvents.add(REFRESH_TIME, () => {
            this.hasRenderedRecently = false;
        }, this);
    }

    private updateUnitAndBuildingGraphics() {
        this.unitAndBuildingGraphics.clear();

        this.worldKnowledge.getArmies().forEach((unit) => {
            if (null !== unit.getPlayer()) {
                this.unitAndBuildingGraphics.beginFill(unit.getPlayer().getColor());
                this.unitAndBuildingGraphics.lineStyle(1, unit.getPlayer().getColor());
                unit.getCellPositions().forEach((cellPosition) => {
                    this.unitAndBuildingGraphics.drawRect(
                        cellPosition.x,
                        cellPosition.y,
                        1,
                        1
                    );
                });
            }
        });
    }

    private updateFogGraphics() {
        this.fogGraphics.clear();
        this.fogGraphics.beginFill(0x000000);

        const fogKnownCells = this.worldKnowledge.getFogKnownCells(this.player);
        for (let y = 0; y < fogKnownCells.length; y++) {
            for (let x = 0; x < fogKnownCells[y].length; x++) {
                if (!fogKnownCells[y][x]) {
                    this.fogGraphics.drawRect(x, y, 1, 1);
                }
            }
        }
    }

    private udpateRectGraphics() {
        this.rectGraphics.clear();

        const cameraView = this.layer.game.camera.view;
        const scaleCamera = this.scale / SCALE / GROUND_SIZE;

        this.rectGraphics.lineStyle(1, 0xffffff);
        this.rectGraphics.endFill();
        this.rectGraphics.drawRect(
            cameraView.x * scaleCamera,
            cameraView.y * scaleCamera,
            (cameraView.width - INTERFACE_WIDTH) * scaleCamera,
            cameraView.height * scaleCamera
        );
    }
}
