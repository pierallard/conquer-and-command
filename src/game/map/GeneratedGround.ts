import {SCALE} from "../game_state/Play";

const WIDTH = 40;
const HEIGHT = 40;

export class GeneratedGround {
    private map: Phaser.Tilemap;

    create(game: Phaser.Game) {
        let cells = this.createFakeData();
        let data = this.createCSV(cells);

        game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
        this.map = game.add.tilemap('dynamicMap', 20, 20, WIDTH, HEIGHT);
        this.map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 0, 0);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 0, 100);
        this.map.addTilesetImage('Ice2Snow', 'Ice2Snow', 20, 20, 0, 0, 200);
        this.map.addTilesetImage('Snow', 'Snow', 20, 20, 0, 0, 300);
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
        let lines = [];
        for (let y = 0; y < HEIGHT; y++) {
            let line = [];
            for (let x = 0; x < WIDTH; x++) {
                line.push(null);
            }
            lines.push(line);
        }

        lines[Math.round(WIDTH / 4)][Math.round(HEIGHT / 4)] = 312;
        lines[Math.round(WIDTH * 3 / 4)][Math.round(HEIGHT / 4)] = 312;
        lines[Math.round(WIDTH * 3 / 4)][Math.round(HEIGHT * 3 / 4)] = 312;
        lines[Math.round(WIDTH / 4)][Math.round(HEIGHT * 3/ 4)] = 312;
        lines[Math.round(WIDTH / 2)][Math.round(HEIGHT / 2)] = 212;
        lines[Math.round(WIDTH / 2)][Math.round(HEIGHT * 3 / 4)] = 212;
        lines[Math.round(WIDTH / 4)][Math.round(HEIGHT / 2)] = 212;
        lines[Math.round(WIDTH * 3 / 4)][Math.round(HEIGHT / 2)] = 212;
        lines[Math.round(WIDTH / 2)][Math.round(HEIGHT / 4)] = 212;

        let shouldIContinue = true;
        while (shouldIContinue) {
            let extensibleCells = [];
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (lines[y][x] !== null && (
                            (y > 0 && lines[y - 1][x] === null) ||
                            (x > 0 && lines[y][x - 1] === null) ||
                            (x < WIDTH - 1 && lines[y][x + 1] === null) ||
                            (y < HEIGHT - 1 && lines[y + 1][x] === null))
                    ) {
                        extensibleCells.push(new PIXI.Point(x, y));
                    }
                }
            }
            if (extensibleCells.length === 0) {
                shouldIContinue = false;
            } else {
                let randomCell = extensibleCells[Math.floor(Math.random() * extensibleCells.length)];
                let extensible = [];
                if (randomCell.y > 0 && lines[randomCell.y - 1][randomCell.x] === null) {
                    extensible.push(new PIXI.Point(randomCell.x, randomCell.y - 1));
                }
                if (randomCell.x > 0 && lines[randomCell.y][randomCell.x - 1] === null) {
                    extensible.push(new PIXI.Point(randomCell.x - 1, randomCell.y));
                }
                if (randomCell.x < WIDTH - 1 && lines[randomCell.y][randomCell.x + 1] === null) {
                    extensible.push(new PIXI.Point(randomCell.x + 1, randomCell.y));
                }
                if (randomCell.y < HEIGHT - 1 && lines[randomCell.y + 1][randomCell.x] === null) {
                    extensible.push(new PIXI.Point(randomCell.x, randomCell.y + 1));
                }
                let randomExtensible = extensible[Math.floor(Math.random() * extensible.length)];
                lines[randomExtensible.y][randomExtensible.x] = lines[randomCell.y][randomCell.x];
            }
        }

        return lines;
    }

    private createCSV(cells: number[][]): string {
        return cells.map((line) => {
            return line.join(',');
        }).join("\n");
    }
}
