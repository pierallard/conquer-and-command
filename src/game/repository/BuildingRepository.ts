import {Base} from "../building/Base";
import Play from "../game_state/Play";
import {Player} from "../player/Player";

export class BuildingRepository {
    private play_: Play;
    private buildings: Base[];

    constructor(play: Play) {
        this.play_ = play;
        this.buildings = [];
    }

    generateRandomBuildings(players: Player[]) {
        this.buildings.push(
            new Base(this.play_.game, 10, 5)
        );
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        for (let i = 0; i < this.buildings.length; i++) {
            let building = this.buildings[i];
            for (let x = 0; x < building.getCellWidth(); x++) {
                for (let y = 0; y < building.getCellHeight(); y++) {
                    if (building.getCellPosition().x + x === position.x &&
                        building.getCellPosition().y + y === position.y) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
}
