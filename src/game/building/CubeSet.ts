import {Cube} from "./Cube";
import {Building} from "./Building";

export class CubeSet implements Building {
    private cubes: Cube[];
    private cubePositions: PIXI.Point[];

    constructor(cubePositions: PIXI.Point[]) {
        this.cubePositions = cubePositions;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.cubes = this.cubePositions.map((position) => {
            return new Cube(game, position.x, position.y, group);
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

    setVisible(value: boolean) {
    }

    private checkEmptyCubes() {
        this.cubes = this.cubes.filter((cube) => {
            return !cube.isEmpty();
        });
    }
}
