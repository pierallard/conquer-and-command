import {SCALE} from "../game_state/Play";
import {GROUND_SIZE} from "../map/Ground";
import {GAME_HEIGHT, GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {Cell} from "../computing/Cell";

const SECURITY_MARGIN = 3;

export class FogSprite {
    private graphics: Phaser.Graphics;
    private camera: Phaser.Camera;
    private lastCameraPosition: PIXI.Point;
    private sprites: Phaser.Sprite[];
    private group: Phaser.Group;
    private game: Phaser.Game;

    create(game: Phaser.Game, group: Phaser.Group) {
        this.graphics = new Phaser.Graphics(game, 0, 0);
        this.graphics.scale.set(SCALE, SCALE);
        this.camera = game.camera;
        this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
        this.sprites = [];
        this.group = group;
        this.game = game;

        group.add(this.graphics);
    }

    update(knownCells: boolean[][], force: boolean) {
        if (force ||
            this.camera.position.x !== this.lastCameraPosition.x ||
            this.camera.position.y !== this.lastCameraPosition.y)
        {
            this.graphics.clear();
            this.graphics.beginFill(0x0000);

            this.sprites.forEach((sprite) => {
                sprite.destroy(true);
            });

            const top = Cell.realToCell(this.graphics.game.camera.position.y);
            const left = Cell.realToCell(this.graphics.game.camera.position.x);
            const height = Cell.realToCell(GAME_HEIGHT);
            const width = Cell.realToCell(GAME_WIDTH - INTERFACE_WIDTH);

            for (let y = top - SECURITY_MARGIN; y < top + height + 1 + SECURITY_MARGIN; y++) {
                for (let x = left - SECURITY_MARGIN; x < left + width + 1 + SECURITY_MARGIN; x++) {
                    if (undefined !== knownCells[y] && undefined !== knownCells[y][x]) {
                        const layer = FogSprite.getLayer(knownCells, x, y);
                        if (layer >= 0) {
                            let sprite = new Phaser.Sprite(
                                this.game,
                                x * GROUND_SIZE * SCALE + GROUND_SIZE * SCALE / 2,
                                y * GROUND_SIZE * SCALE + GROUND_SIZE * SCALE / 2,
                                'Dark',
                                layer
                            );
                            sprite.scale.setTo(SCALE);
                            this.group.add(sprite);

                            this.sprites.push(sprite);
                        } else if (layer === -1000) {
                            this.graphics.drawRect(
                                x * GROUND_SIZE + GROUND_SIZE / 2,
                                y * GROUND_SIZE + GROUND_SIZE / 2,
                                GROUND_SIZE,
                                GROUND_SIZE
                            );
                        }
                    }
                }
            }

            this.lastCameraPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
        }
    }

    private static getLayer(knownCells: boolean[][], x: number, y: number) {
        const topLeft = knownCells[y][x];
        const topRight = knownCells[y][x + 1];
        const bottomLeft = knownCells[y + 1][x];
        const bottomRight = knownCells[y + 1][x + 1];
        if (topLeft) {
            if (topRight) {
                if (bottomLeft) {
                    return bottomRight ? -1 : 8;
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
                    return bottomRight ? 0 : -1000;
                }
            }
        }
    }
}
