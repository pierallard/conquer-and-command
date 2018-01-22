import {State} from "./State";
import {Orca} from "../unit/Orca";
import {Helipad} from "../building/Helipad";
import {Stand} from "./Stand";
import {Distance} from "../computing/Distance";

export class Reload implements State {
    private orca: Orca;
    private helipad: Helipad;

    constructor(orca: Orca, helipad: Helipad) {
        this.orca = orca;
        this.helipad = helipad;
    }

    getNextStep(): State {
        if (this.orca.isFullyReloaded()) {
            return new Stand(this.orca);
        }

        return this;
    }

    run(): void {
        if (this.orca.getCurrentHelipad() !== this.helipad) {
            const closestHelipadPoint = Distance.getClosestPosition(
                this.orca.getCellPositions()[0],
                this.helipad.getCellPositions()
            );
            this.orca.moveTowards(closestHelipadPoint);
        } else {
            if (!this.orca.isFullyReloaded()) {
                this.orca.reload();
            }
        }
    }
}
