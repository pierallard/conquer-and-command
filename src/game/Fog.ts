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

        const units = this.worldKnowledge.getPlayerUnits(this.player);
        const buildings = this.worldKnowledge.getPlayerBuildings(this.player);
        for (let y = 0; y < GROUND_HEIGHT; y++) {
            for (let x = 0; x < GROUND_WIDTH; x++) {
                if (!this.knownCells[y][x] && Fog.unitShowCell(units, buildings, x, y)) {
                    this.knownCells[y][x] = true;
                }
            }
        }

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
