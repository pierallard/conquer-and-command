import {State} from "./State";
import {AStarSprite} from "../sprite/AStarSprite";

export class Stand implements State {
    private unit: AStarSprite;

    constructor(unit: AStarSprite) {
        this.unit = unit;
    }

    getNextStep(): State {
        return this;
    }

    run(): void {
        const shootable = this.unit.getClosestShootable();
        if (shootable) {
            this.unit.shoot(shootable);
        }
    }
}
