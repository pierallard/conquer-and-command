import {Player} from "./player/Player";
import {WorldKnowledge} from "./map/WorldKnowledge";
import {GROUND_HEIGHT, GROUND_WIDTH} from "./map/GeneratedGround";
import {Unit} from "./unit/Unit";
import {Distance} from "./computing/Distance";
import {Building} from "./building/Building";
import {FogSprite} from "./sprite/FogSprite";

const REFRESH_TIME = 0.5 * Phaser.Timer.SECOND;

export class Fog {
    private static unitShowCell(units: Unit[], buildings: Building[], x: number, y: number): boolean {
        for (let i = 0; i < units.length; i++) {
            if (Distance.to(units[i].getCellPositions(), new PIXI.Point(x, y)) < 10) {
                return true;
            }
        }

        for (let i = 0; i < buildings.length; i++) {
            if (Distance.to(buildings[i].getCellPositions(), new PIXI.Point(x, y)) < 10) {
                return true;
            }
        }

        return false;
    }

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
        if (this.hasRenderedRecently) {
            return;
        }

        this.worldKnowledge.getPlayerUnits(this.player).forEach((unit) => {
            unit.getCellPositions().forEach((unitCell) => {
                Distance.getDisc(4).forEach((cell) => {
                    this.knownCells[unitCell.y + cell.y][unitCell.x + cell.x] = true;
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

        if (this.sprite) {
            this.sprite.update(this.knownCells);
        }

        this.hasRenderedRecently = true;
        this.timeEvents.add(REFRESH_TIME, () => {
            this.hasRenderedRecently = false;
        }, this);
    }

    getPlayer() {
        return this.player;
    }
}
