import {Cube} from "./Cube";
import {Building} from "./Building";

export class CubeSet implements Building {
    private cubes: Cube[];

    constructor(game: Phaser.Game, cubePositions: PIXI.Point[]) {
        this.cubes = cubePositions.map((position) => {
            return new Cube(game, position.x, position.y);
        });
    }

    getCellPositions(): PIXI.Point[] {
        this.checkEmptyCubes();
        return this.cubes.map((cube) => {
            return cube.getCellPositions()[0];
        });
    }

    isEmpty() {
        this.checkEmptyCubes();
        for (let i = 0; i < this.cubes.length; i++) {
            if (!this.cubes[i].isEmpty()) {
                return false;
            }
        }

        return true;
    }

    getCubes(): Cube[] {
        this.checkEmptyCubes();
        return this.cubes;
    }

    private checkEmptyCubes() {
        this.cubes = this.cubes.filter((cube) => {
            return !cube.isEmpty();
        });
    }
}
