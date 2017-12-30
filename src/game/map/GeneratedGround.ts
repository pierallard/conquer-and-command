import {SCALE} from "../game_state/Play";
import {AlternativePosition} from "../computing/AlternativePosition";

export const GROUND_WIDTH = 56;
export const GROUND_HEIGHT = 35;

enum TERRAIN {
    SNOW = 312,
    ICE = 212,
    CRATER = 412,
    ICE_BREAK2 = 512,
    GRASS = 640,
    WATER = 612,
    MOUNTAIN = 712,
    STONE = 930,
}

const MIN = 0.2;
const MAX = 0.8;
const TERRAINS = [TERRAIN.WATER, TERRAIN.GRASS, TERRAIN.MOUNTAIN, TERRAIN.SNOW, TERRAIN.STONE];
const STEP = (MAX - MIN) / TERRAINS.length;

export class GeneratedGround {
    private static generateNoises(max: number, predefinedTiles: any): number[][] {
        const maps = [];
        for (let i = 0; i <= max; i++) {
            maps.push(this.generateNoise(i, predefinedTiles));
        }

        const result = [];
        for (let y = 0; y <= GROUND_HEIGHT; y++) {
            const resultLine = [];
            for (let x = 0; x <= GROUND_WIDTH; x++) {
                let value = 0;
                let count = 0;
                for (let i = 0; i <= max; i++) {
                    value += maps[i][y][x] * i;
                    count += i;
                }
                resultLine.push(value / count);
            }
            result.push(resultLine);
        }

        console.log(result);
        return result;
    }

    private static generateNoise(power: number, predefinedTiles: any): number[][] {
        const littleMapWidth = Math.ceil(GROUND_WIDTH / Math.pow(2, power));
        const littleMapHeight = Math.ceil(GROUND_HEIGHT / Math.pow(2, power));
        const littleMap = [];
        const littlePredefinedTiles = predefinedTiles.map((predefinedTile) => {
            return [new PIXI.Point(
                Math.floor(predefinedTile[0].x / Math.pow(2, power)),
                Math.floor(predefinedTile[0].y / Math.pow(2, power))
            ), predefinedTile[1]];
        });
        for (let y = 0; y <= littleMapHeight; y++) {
            const littleMapLine = [];
            for (let x = 0; x <= littleMapWidth; x++) {
                let value = Math.random();
                littlePredefinedTiles.forEach((predefinedTile) => {
                    const position = predefinedTile[0];
                    if (position.x === x && position.y === y) {
                        value = GeneratedGround.textureToRand(predefinedTile[1]);
                    }
                });
                littleMapLine.push(value);
            }
            littleMap.push(littleMapLine);
        }
        const result = [];
        for (let y = 0; y <= GROUND_HEIGHT; y++) {
            const resultLine = [];
            for (let x = 0; x <= GROUND_WIDTH; x++) {
                resultLine.push(littleMap[Math.floor(y / Math.pow(2, power))][Math.floor(x / Math.pow(2, power))]);
            }
            result.push(resultLine);
        }

        return this.fluzz(result, Math.floor(Math.pow(2, power) / 2) + 1);
    }

    private static fluzz(cells: number[][], radius: number): number[][] {
        const result = [];
        for (let y = 0; y <= GROUND_HEIGHT; y++) {
            const resultLine = [];
            for (let x = 0; x <= GROUND_WIDTH; x++) {
                resultLine.push(this.getAvgAroundCellValues(cells, radius, x, y));
            }
            result.push(resultLine);
        }
        return result;
    }

    private static getAvgAroundCellValues(cells: number[][], radius: number, startX: number, startY: number): number {
        const cellsValues = [];
        for (let y = startY - radius; y <= startY + radius; y++) {
            for (let x = startX - radius; x <= startX + radius; x++) {
                if (y >= 0 && x >= 0 && y <= GROUND_HEIGHT && x <= GROUND_WIDTH) {
                    cellsValues.push(cells[y][x]);
                }
            }
        }

        return cellsValues.reduce((cell, previousval) => {
                return cell + previousval;
            }, 0) / cellsValues.length;
    }

    private static randToTexture(rand: number): number {
        let val = TERRAINS[TERRAINS.length - 1];
        if (rand < MIN) {
            return TERRAINS[0]
        }
        for (let i = 0; i < TERRAINS.length; i++) {
            if (rand >= MIN + i * STEP && rand <= MIN + (i + 1) * STEP) {
                val = TERRAINS[i];
            }
        }
        return val;
    }

    private static textureToRand(texture: number): number {
        const index = TERRAINS.indexOf(texture);

        return MIN + (index + 0.5) * STEP;
    }

    private generatedTiles: number[][];
    private map: Phaser.Tilemap;
    private cornersMap: number[][];
    private tiles: Object;
    private collisions: number[] = [];

    constructor() {
        this.tiles = {
            312: [TERRAIN.SNOW, TERRAIN.SNOW, TERRAIN.SNOW, TERRAIN.SNOW],
            212: [TERRAIN.ICE, TERRAIN.ICE, TERRAIN.ICE, TERRAIN.ICE],
            412: [TERRAIN.CRATER, TERRAIN.CRATER, TERRAIN.CRATER, TERRAIN.CRATER],
            640: [TERRAIN.GRASS, TERRAIN.GRASS, TERRAIN.GRASS, TERRAIN.GRASS],
            612: [TERRAIN.WATER, TERRAIN.WATER, TERRAIN.WATER, TERRAIN.WATER],
            712: [TERRAIN.MOUNTAIN, TERRAIN.MOUNTAIN, TERRAIN.MOUNTAIN, TERRAIN.MOUNTAIN],
            930: [TERRAIN.STONE, TERRAIN.STONE, TERRAIN.STONE, TERRAIN.STONE],
        };
        this.collisions.push(TERRAIN.WATER);
        this.initializeTiles();
    }

    create(game: Phaser.Game, startPositions: PIXI.Point[]) {
        this.createFakeData2(startPositions.reduce((previous, startPosition) => {
            AlternativePosition.getSquareClosest(startPosition, 5).forEach((position) => {
                previous.push([position, TERRAIN.GRASS]);
            });
            return previous;
        }, []));
        let data = this.getCSV();

        game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
        this.map = game.add.tilemap('dynamicMap', 20, 20, GROUND_WIDTH, GROUND_HEIGHT);
        this.map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 0, 0);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 0, 100);
        this.map.addTilesetImage('Ice2Snow', 'Ice2Snow', 20, 20, 0, 0, 200);
        this.map.addTilesetImage('Snow', 'Snow', 20, 20, 0, 0, 300);
        this.map.addTilesetImage('Snw2Crtb', 'Snw2Crtb', 20, 20, 0, 0, 400);
        this.map.addTilesetImage('IceBrk2', 'IceBrk2', 20, 20, 0, 0, 500);
        this.map.addTilesetImage('Grs2Watr', 'Grs2Watr', 20, 20, 0, 0, 600);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', 20, 20, 0, 0, 700);
        this.map.addTilesetImage('Snw2Mnt', 'Snw2Mnt', 20, 20, 0, 0, 800);
        this.map.addTilesetImage('Stn2SnwB', 'Stn2SnwB', 20, 20, 0, 0, 900);
        let layer = this.map.createLayer(0);
        layer.scale.setTo(SCALE, SCALE);
        game.add.existing(layer);

        /*
        const zones = AlternativePosition.getZones(this.isCellAccessible.bind(this));
        let graphics = game.add.graphics(0, 0);
        graphics.alpha = 0.5;
        for (let z = 0; z < zones.length; z++) {
            if (zones[z].length > 0) {
                game.add.text(zones[z][0].x * 40, zones[z][0].y * 40, z + '');
            }
            graphics.beginFill(Phaser.Color.getRandomColor(0, 255, 200));
            for (let i = 0; i < zones[z].length; i++) {
                graphics.drawRect(zones[z][i].x * 40, zones[z][i].y * 40, 40, 40);
            }
        }
        */
    }

    isCellAccessible(position: PIXI.Point): boolean {
        if (position.x < 0 || position.y < 0 || position.x >= GROUND_WIDTH || position.y >= GROUND_HEIGHT) {
            return false;
        }

        const value = this.generatedTiles[position.y][position.x];

        return this.collisions.indexOf(value) <= -1;
    }

    getGroundWidth() {
        return this.map.widthInPixels * SCALE;
    }

    getGroundHeight() {
        return this.map.heightInPixels * SCALE;
    }

    getCSV(): string {
        if (this.generatedTiles !== null) {
            this.generatedTiles = [];
            for (let y = 0; y < GROUND_HEIGHT; y++) {
                let line = [];
                for (let x = 0; x < GROUND_WIDTH; x++) {
                    line.push(this.getTileNumber(this.getCorners(x, y)));
                }
                this.generatedTiles.push(line);
            }
        }

        return this.generatedTiles.map((line) => {
            return line.join(',');
        }).join("\n");
    }

    private initializeTiles() {
        this.initializeTerrain(200, TERRAIN.SNOW, TERRAIN.ICE, true);
        this.initializeTerrain(400, TERRAIN.SNOW, TERRAIN.CRATER, true);
        this.initializeTerrain(500, TERRAIN.ICE, TERRAIN.ICE_BREAK2, false);
        this.initializeTerrain(600, TERRAIN.GRASS, TERRAIN.WATER, true, true);
        this.initializeTerrain(700, TERRAIN.MOUNTAIN, TERRAIN.GRASS, true);
        this.initializeTerrain(800, TERRAIN.MOUNTAIN, TERRAIN.SNOW, true);
        this.initializeTerrain(900, TERRAIN.STONE, TERRAIN.SNOW, true);
    }

    private initializeTerrain(
        startNumber: number,
        terrain1: TERRAIN,
        terrain2: TERRAIN,
        rightGap: boolean = true,
        isCollision: boolean = false
    ) {
        let result = {};
        result[startNumber] = [terrain1, terrain1, terrain2, terrain1];
        result[startNumber + 2] = [terrain1, terrain1, terrain2, terrain2];
        result[startNumber + 4] = [terrain1, terrain1, terrain1, terrain2];
        result[startNumber + 10] = [terrain1, terrain2, terrain2, terrain1];
        result[startNumber + 14] = [terrain2, terrain1, terrain1, terrain2];
        result[startNumber + 20] = [terrain1, terrain2, terrain1, terrain1];
        result[startNumber + 22] = [terrain2, terrain2, terrain1, terrain1];
        result[startNumber + 24] = [terrain2, terrain1, terrain1, terrain1];
        result[startNumber + (rightGap ? 32 : 30)] = [terrain1, terrain2, terrain2, terrain2];
        result[startNumber + (rightGap ? 34 : 32)] = [terrain2, terrain1, terrain2, terrain2];
        result[startNumber + (rightGap ? 42 : 40)] = [terrain2, terrain2, terrain2, terrain1];
        result[startNumber + (rightGap ? 44 : 42)] = [terrain2, terrain2, terrain1, terrain2];

        if (isCollision) {
            this.collisions.push(startNumber);
            this.collisions.push(startNumber + 2);
            this.collisions.push(startNumber + 4);
            this.collisions.push(startNumber + 10);
            this.collisions.push(startNumber + 14);
            this.collisions.push(startNumber + 20);
            this.collisions.push(startNumber + 22);
            this.collisions.push(startNumber + 24);
            this.collisions.push(startNumber + (rightGap ? 32 : 30));
            this.collisions.push(startNumber + (rightGap ? 34 : 32));
            this.collisions.push(startNumber + (rightGap ? 42 : 40));
            this.collisions.push(startNumber + (rightGap ? 44 : 42));
        }

        this.tiles = Object.assign(this.tiles, result);
    }

    private createFakeData2(predefinedTiles: any): void {
        this.cornersMap = [];
        const noises = GeneratedGround.generateNoises(4, predefinedTiles);

        for (let y = 0; y <= GROUND_HEIGHT; y++) {
            let line = [];
            for (let x = 0; x <= GROUND_WIDTH; x++) {
                line.push(GeneratedGround.randToTexture(noises[y][x]));
            }
            this.cornersMap.push(line);
        }
    }

    private getCorners(x, y) {
        return [
            this.cornersMap[y][x],
            this.cornersMap[y][x + 1],
            this.cornersMap[y + 1][x + 1],
            this.cornersMap[y + 1][x],
        ];
    }

    private getTileNumber(param: number[]): number {
        const keys = Object.keys(this.tiles);
        for (let i = 0; i < keys.length; i++) {
            if (this.tiles[keys[i]][0] === param[0] &&
                this.tiles[keys[i]][1] === param[1] &&
                this.tiles[keys[i]][2] === param[2] &&
                this.tiles[keys[i]][3] === param[3]) {
                return parseInt(keys[i]);
            }
        }

        return null;
    }
}
