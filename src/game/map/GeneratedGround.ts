import {SCALE} from "../game_state/Play";

const WIDTH = 80;
const HEIGHT = 80;

enum TERRAIN {
    SNOW = 312,
    ICE = 212,
    CRATERE = 412,
}

export class GeneratedGround {
    private map: Phaser.Tilemap;
    private cornersMap: number[][];
    private tiles: Object;

    constructor() {
        this.tiles = {
            312: [TERRAIN.SNOW, TERRAIN.SNOW, TERRAIN.SNOW, TERRAIN.SNOW],
        };
        this.tiles = Object.assign(this.tiles, GeneratedGround.generate(200, TERRAIN.SNOW, TERRAIN.ICE));
        this.tiles = Object.assign(this.tiles, GeneratedGround.generate(400, TERRAIN.SNOW, TERRAIN.CRATERE));
    }

    create(game: Phaser.Game) {
        let cells = this.createFakeData();
        let data = this.createCSV();

        game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
        this.map = game.add.tilemap('dynamicMap', 20, 20, WIDTH, HEIGHT);
        this.map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 0, 0);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 0, 100);
        this.map.addTilesetImage('Ice2Snow', 'Ice2Snow', 20, 20, 0, 0, 200);
        this.map.addTilesetImage('Snow', 'Snow', 20, 20, 0, 0, 300);
        this.map.addTilesetImage('Snw2Crtb', 'Snw2Crtb', 20, 20, 0, 0, 400);
        let layer = this.map.createLayer(0);
        layer.scale.setTo(SCALE, SCALE);
        game.add.existing(layer);
    }

    isCellAccessible(position: PIXI.Point): boolean {
        return true;
    }

    getGroundWidth() {
        return this.map.widthInPixels * SCALE;
    }

    getGroundHeight() {
        return this.map.heightInPixels * SCALE;
    }

    private createFakeData() {
        this.cornersMap = [];
        for (let y = 0; y <= HEIGHT; y++) {
            let line = [];
            for (let x = 0; x <= WIDTH; x++) {
                line.push(TERRAIN.SNOW);
            }
            this.cornersMap.push(line);
        }

        for (let i = 0; i < 10000; i++) {
            let x = Math.floor(Math.random() * WIDTH);
            let y = Math.floor(Math.random() * HEIGHT);

            const tests = [TERRAIN.SNOW, TERRAIN.ICE, TERRAIN.CRATERE].filter((terrain) => {
                return terrain !== this.cornersMap[y][x];
            }).sort((a, b) => { return Math.random() - 0.5; });

            let found = false;
            for (let j = 0; j < tests.length; j++) {
                if (!found && this.isPossibleSwitchWith(x, y, tests[j])) {
                    this.cornersMap[y][x] = tests[j];
                    found = true;
                }
            }
        }
    }

    private isPossibleSwitchWith(x: number, y: number, value: TERRAIN): boolean {
        let square = this.getCorners(x, y);
        square[0] = value;
        if (null === this.getTileNumber(square)) {
            return false;
        }

        if (x > 0 && y > 0) {
            square = this.getCorners(x - 1, y - 1);
            square[2] = value;
            if (null === this.getTileNumber(square)) {
                return false;
            }
        }

        if (y > 0) {
            square = this.getCorners(x, y - 1);
            square[3] = value;
            if (null === this.getTileNumber(square)) {
                return false;
            }
        }

        if (x > 0) {
            square = this.getCorners(x - 1, y);
            square[1] = value;
            if (null === this.getTileNumber(square)) {
                return false;
            }
        }

        return true;
    }

    private createCSV(): string {
        let lines = [];
        for (let y = 0; y < HEIGHT; y++) {
            let line = [];
            for (let x = 0; x < WIDTH; x++) {
                line.push(this.getTileNumber(this.getCorners(x, y)));
            }
            lines.push(line);
        }

        return lines.map((line) => {
            return line.join(',');
        }).join("\n");
    }

    private getCorners(x, y) {
        return [
            this.cornersMap[y][x],
            this.cornersMap[y][x + 1],
            this.cornersMap[y + 1][x + 1],
            this.cornersMap[y + 1][x]
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

    private static generate(startNumber: number, terrain1: TERRAIN, terrain2: TERRAIN) {
        let result = {};
        result[startNumber] = [terrain1, terrain1, terrain2, terrain1];
        result[startNumber + 2] = [terrain1, terrain1, terrain2, terrain2];
        result[startNumber + 4] = [terrain1, terrain1, terrain1, terrain2];
        result[startNumber + 10] = [terrain1, terrain2, terrain2, terrain1];
        result[startNumber + 12] = [terrain2, terrain2, terrain2, terrain2];
        result[startNumber + 14] = [terrain2, terrain1, terrain1, terrain2];
        result[startNumber + 20] = [terrain1, terrain2, terrain1, terrain1];
        result[startNumber + 22] = [terrain2, terrain2, terrain1, terrain1];
        result[startNumber + 24] = [terrain2, terrain1, terrain1, terrain1];
        result[startNumber + 32] = [terrain1, terrain2, terrain2, terrain2];
        result[startNumber + 34] = [terrain2, terrain1, terrain2, terrain2];
        result[startNumber + 42] = [terrain2, terrain2, terrain2, terrain1];
        result[startNumber + 44] = [terrain2, terrain2, terrain1, terrain2];

        return result;
    }
}
