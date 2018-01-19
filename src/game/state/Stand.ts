import {State} from "./State";
import {Unit} from "../unit/Unit";

export class Stand implements State {
    private unit: Unit;

    constructor(unit: Unit) {
        this.unit = unit;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        if (this.unit.canShoot()) {
            const shootable = this.unit.getClosestShootable();
            if (shootable) {
                this.unit.shoot(shootable);
            }
        }
    }
}
