import {Base} from "../building/Base";
import Play from "../game_state/Play";
import {Player} from "../player/Player";
import {Building} from "../building/Building";
import {CubeSet} from "../building/CubeSet";
import {Power} from "../building/Power";

export class BuildingRepository {
    private play_: Play;
    private buildings: Building[];
    private group: Phaser.Group;

    constructor(play: Play, group: Phaser.Group) {
        this.play_ = play;
        this.group = group;
        this.buildings = [];
    }

    generateRandomBuildings(players: Player[]) {
        this.buildings.push(
            new Base(this.play_.game, 10, 5, this.group),
            new Power(this.play_.game, 10, 10, this.group, players[0]),
            new CubeSet(this.play_.game, [
                new PIXI.Point(9, 18),
                new PIXI.Point(10, 18),
                new PIXI.Point(11, 18),
                new PIXI.Point(12, 18),
                new PIXI.Point(13, 17),
            ], this.group)
        );
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return this.buildingAt(position) === null;
    }

    buildingAt(position: PIXI.Point): Building {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            const cellPositions = building.getCellPositions();
            for (let j = 0; j < cellPositions.length; j++) {
                if (cellPositions[j].x === position.x &&
                    cellPositions[j].y === position.y) {
                    return building;
                }
            }
        }

        return null;
    }

    getBuildings() {
        return this.buildings;
    }

    getCreatorOf(unit: string): Building {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            if (building instanceof Power) {
                return building;
            }
        }

        return null;
    }
}
