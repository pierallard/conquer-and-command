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

export class Minimap {
    private static rectsContains(rects: PIXI.Point[], pos: PIXI.Point): boolean {
        for (let i = 0; i < rects.length; i++) {
            if (rects[i].x === pos.x && rects[i].y === pos.y) {
                return true;
            }
        }

        return false;
    }

    private unitAndBuildingGraphics: Phaser.Graphics;
    private fogGraphics: Phaser.Graphics;
    private rectGraphics: Phaser.Graphics;
    private worldKnowledge: WorldKnowledge;
    private hasRenderedRecently: boolean = false;
    private layer: Phaser.TilemapLayer;
    private timerEvents: Phaser.Timer;
    private scale: number;
    private player: Player;
    private multiplicator: number;

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

        this.scale = SIZE / Math.max(GROUND_WIDTH, GROUND_HEIGHT) * 2;
        let position = new PIXI.Point(X * 2, Y * 2);
        if (GROUND_WIDTH > GROUND_HEIGHT) {
            position.y = position.y + (SIZE * 2 - GROUND_HEIGHT * this.scale) / 2;
        } else {
            position.x = position.x + (SIZE * 2 - GROUND_WIDTH * this.scale) / 2;
        }
        this.layer.scale.setTo(this.scale, this.scale);
        this.layer.fixedToCamera = false;
        this.layer.position.setTo(position.x, position.y);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;

        const secondScale = SIZE * 2 / Math.max(GROUND_WIDTH, GROUND_HEIGHT);
        this.unitAndBuildingGraphics = new Phaser.Graphics(game);
        this.unitAndBuildingGraphics.position.setTo(position.x, position.y);
        this.unitAndBuildingGraphics.fixedToCamera = true;
        this.unitAndBuildingGraphics.scale.set(secondScale, secondScale);
        game.add.existing(this.unitAndBuildingGraphics);

        this.fogGraphics = new Phaser.Graphics(game);
        this.fogGraphics.position.setTo(position.x, position.y);
        this.fogGraphics.fixedToCamera = true;
        this.fogGraphics.scale.set(secondScale, secondScale);
        game.add.existing(this.fogGraphics);

        this.rectGraphics = new Phaser.Graphics(game);
        this.rectGraphics.position.setTo(position.x, position.y);
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

        this.multiplicator = Math.ceil(Math.sqrt(GROUND_WIDTH * GROUND_HEIGHT / 1000));
        console.log(this.multiplicator);
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
        this.unitAndBuildingGraphics.lineStyle(null);

        let rects = [];
        this.worldKnowledge.getArmies().forEach((unit) => {
            if (null !== unit.getPlayer()) {
                const color = unit.getPlayer().getColor();
                if (!rects[color]) {
                    rects[color] = [];
                }
                unit.getCellPositions().forEach((cellPosition) => {
                    const pos = new PIXI.Point(
                        Math.round(cellPosition.x / this.multiplicator),
                        Math.round(cellPosition.y / this.multiplicator),
                    );
                    if (!Minimap.rectsContains(rects[color], pos)) {
                        rects[color].push(pos);
                    }
                });
            }
        });


        for (let i = 0; i < Object.keys(rects).length; i++) {
            this.unitAndBuildingGraphics.beginFill(+Object.keys(rects)[i]);
            rects[+Object.keys(rects)[i]].forEach((rect) => {
                this.unitAndBuildingGraphics.drawRect(
                    rect.x * this.multiplicator,
                    rect.y * this.multiplicator,
                    this.multiplicator,
                    this.multiplicator
                );
            });
        }
    }

    private updateFogGraphics() {
        this.fogGraphics.clear();
        this.fogGraphics.beginFill(0x000000);

        const fogKnownCells = this.worldKnowledge.getFogKnownCells(this.player);
        for (let y = 0; y < fogKnownCells.length; y += this.multiplicator) {
            for (let x = 0; x < fogKnownCells[y].length; x+= this.multiplicator) {
                let addRect = false;
                for (let gapX = 0; !addRect && gapX < this.multiplicator; gapX++) {
                    for (let gapY = 0; !addRect && gapY < this.multiplicator; gapY++) {
                        if (!fogKnownCells[y][x]) {
                            addRect = true;
                        }
                    }
                }
                if (addRect) {
                    this.fogGraphics.drawRect(x, y, this.multiplicator, this.multiplicator);
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
