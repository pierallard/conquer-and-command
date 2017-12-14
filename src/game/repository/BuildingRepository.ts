import {Base} from "../building/Base";
import Play from "../game_state/Play";
import {Player} from "../player/Player";
import {Building} from "../building/Building";
import {Cube} from "../building/Cube";

export class BuildingRepository {
    private play_: Play;
    private buildings: Building[];

    constructor(play: Play) {
        this.play_ = play;
        this.buildings = [];
    }

    generateRandomBuildings(players: Player[]) {
        this.buildings.push(
            new Base(this.play_.game, 10, 5),
            new Cube(this.play_.game, 9, 17),
            new Cube(this.play_.game, 10, 18),
            new Cube(this.play_.game, 11, 18),
            new Cube(this.play_.game, 12, 18),
            new Cube(this.play_.game, 13, 17),
        );
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return this.buildingAt(position) === null;
    }

    buildingAt(position: PIXI.Point): Building {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            for (let x = 0; x < building.getCellWidth(); x++) {
                for (let y = 0; y < building.getCellHeight(); y++) {
                    if (building.getCellPosition().x + x === position.x &&
                        building.getCellPosition().y + y === position.y) {
                        return building;
                    }
                }
            }
        }

        return null;
    }

    getBuildings() {
        return this.buildings;
    }
}
