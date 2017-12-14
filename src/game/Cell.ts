import {GROUND_SIZE} from "./Ground";
import {SCALE} from "./game_state/Play";

export class Cell {
    static cellToReal(position) {
        return GROUND_SIZE * SCALE * position + (GROUND_SIZE * SCALE)/2
    }

    static realToCell(position) {
        return Math.round((position - (GROUND_SIZE * SCALE)/2) / (GROUND_SIZE * SCALE));
    }
}
