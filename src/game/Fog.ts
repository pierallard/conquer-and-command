import {Player} from "./player/Player";
import {WorldKnowledge} from "./map/WorldKnowledge";
import {GROUND_HEIGHT, GROUND_WIDTH} from "./map/GeneratedGround";
import {Distance} from "./computing/Distance";
import {FogSprite} from "./sprite/FogSprite";

const REFRESH_TIME = 2 * Phaser.Timer.SECOND;

export class Fog {
    private worldKnowledge: WorldKnowledge;
    private player: Player;
    private knownCells: boolean[][];
    private sprite: FogSprite;
    private timeEvents: Phaser.Timer;
    private hasRenderedRecently: boolean = false;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
        this.sprite = null;
        this.knownCells = [];

        for (let y = 0; y < GROUND_HEIGHT; y++) {
            this.knownCells[y] = [];
            for (let x = 0; x < GROUND_WIDTH; x++) {
                this.knownCells[y][x] = false;
            }
        }
    }

    create(game: Phaser.Game, group: Phaser.Group, addSprite: boolean) {
        this.timeEvents = game.time.events;
        if (addSprite) {
            this.sprite = new FogSprite();
            this.sprite.create(game, group);
        }
    }

    update() {
        if (!this.hasRenderedRecently) {
            this.updateKnownCells();

            this.hasRenderedRecently = true;
            this.timeEvents.add(REFRESH_TIME, () => {
                this.hasRenderedRecently = false;
            }, this);

            if (this.sprite) {
                this.sprite.update(this.knownCells, true);
            }
        } else {
            if (this.sprite) {
                this.sprite.update(this.knownCells, false);
            }
        }
    }

    getPlayer() {
        return this.player;
    }

    private updateKnownCells() {
        this.worldKnowledge.getPlayerUnits(this.player).forEach((unit) => {
            unit.getCellPositions().forEach((unitCell) => {
                Distance.getDisc(4).forEach((cell) => {
                    const y = unitCell.y + cell.y;
                    if (undefined !== this.knownCells[y]) {
                        const x = unitCell.x + cell.x;
                        if (undefined !== this.knownCells[y][x]) {
                            this.knownCells[y][x] = true;
                        }
                    }
                });
            });
        });

        this.worldKnowledge.getPlayerBuildings(this.player).forEach((building) => {
            building.getCellPositions().forEach((buildingCell) => {
                Distance.getDisc(4).forEach((cell) => {
                    const y = buildingCell.y + cell.y;
                    if (undefined !== this.knownCells[y]) {
                        const x = buildingCell.x + cell.x;
                        if (undefined !== this.knownCells[y][x]) {
                            this.knownCells[y][x] = true;
                        }
                    }
                });
            });
        });
    }
}
