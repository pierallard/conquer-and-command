import {SCALE} from "../game_state/Play";
import {GAME_HEIGHT, GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {Cell} from "../computing/Cell";
import {GROUND_HEIGHT, GROUND_WIDTH} from "../map/GeneratedGround";

const SECURITY_MARGIN = 3;

export class FogSprite {
    private static getIndex(knownCells: boolean[][], x: number, y: number) {
        if (y + 1 >= knownCells.length) {
            return 12;
        }
        const topLeft = knownCells[y][x];
        const topRight = knownCells[y][x + 1];
        const bottomLeft = knownCells[y + 1][x];
        const bottomRight = knownCells[y + 1][x + 1];
        if (topLeft) {
            if (topRight) {
                if (bottomLeft) {
                    return bottomRight ? 13 : 8;
                } else {
                    return bottomRight ? 9 : 5;
                }
            } else {
                if (bottomLeft) {
                    return bottomRight ? 11 : 3;
                } else {
                    return bottomRight ? -2 : 4;
                }
            }
        } else {
            if (topRight) {
                if (bottomLeft) {
                    return bottomRight ? 10 : -3;
                } else {
                    return bottomRight ? 7 : 6;
                }
            } else {
                if (bottomLeft) {
                    return bottomRight ? 1 : 2;
                } else {
                    return bottomRight ? 0 : 12;
                }
            }
        }
    }

    private camera: Phaser.Camera;
    private lastCameraPosition: PIXI.Point;
    private group: Phaser.Group;
    private game: Phaser.Game;
    private tilemap: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;

    create(game: Phaser.Game, group: Phaser.Group) {
        this.camera = game.camera;
        this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
        this.group = group;
        this.game = game;

        this.tilemap = new Phaser.Tilemap(game, null, 20, 20, GROUND_WIDTH, GROUND_HEIGHT);
        this.tilemap.addTilesetImage('Dark', 'Dark', 20, 20, 0, 0, 0);
        this.layer = this.tilemap.createLayer(0, (GAME_WIDTH - INTERFACE_WIDTH) / SCALE, GAME_HEIGHT / SCALE, group);
        this.layer.scale.setTo(SCALE, SCALE);
        this.tilemap.widthInPixels = GROUND_WIDTH * 20;
        this.tilemap.heightInPixels = GROUND_HEIGHT * 20;
        this.tilemap.format = 0;

        this.tilemap.layers[0].width = GROUND_WIDTH;
        this.tilemap.layers[0].height = GROUND_HEIGHT;
        this.tilemap.layers[0].data = [];
        for (let y = 0; y < GROUND_HEIGHT; y++) {
            let dataY = [];
            for (let x = 0; x < GROUND_WIDTH; x++) {
                dataY[x] = 0;
            }
            this.tilemap.layers[0].data[y] = dataY;
        }

        for (let y = 0; y < GROUND_HEIGHT; y++) {
            for (let x = 0; x < GROUND_WIDTH; x++) {
                this.tilemap.putTile(12, x, y, this.layer);
            }
        }

        this.layer.fixedToCamera = true;

        group.add(this.layer);
    }

    initialize(knownCells: boolean[][]) {
        this.updateInner(knownCells, 0, 0, knownCells.length - 1, knownCells[0].length - 1);
    }

    update(knownCells: boolean[][], force: boolean) {
        if (force ||
            this.camera.position.x !== this.lastCameraPosition.x ||
            this.camera.position.y !== this.lastCameraPosition.y
        ) {
            const top = Cell.realToCell(this.tilemap.game.camera.position.y);
            const left = Cell.realToCell(this.tilemap.game.camera.position.x);
            const height = Cell.realToCell(GAME_HEIGHT);
            const width = Cell.realToCell(GAME_WIDTH - INTERFACE_WIDTH);

            this.updateInner(knownCells, top, left, height, width);

            this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
        }
    }

    private updateInner(knownCells: boolean[][], top: number, left: number, height: number, width: number) {
        for (let y = top - SECURITY_MARGIN; y < top + height + 1 + SECURITY_MARGIN; y++) {
            for (let x = left - SECURITY_MARGIN; x < left + width + 1 + SECURITY_MARGIN; x++) {
                if (undefined !== knownCells[y] && undefined !== knownCells[y][x]) {
                    const index = FogSprite.getIndex(knownCells, x, y);
                    if (index >= 0) {
                        const currentTile = this.tilemap.getTile(x, y, this.layer);
                        if (currentTile && currentTile.index !== index) {
                            this.tilemap.putTile(index, x, y, this.layer);
                        }
                    }
                }
            }
        }
    }
}
