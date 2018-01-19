import {MoveTo} from "./MoveTo";

export class MoveAttack extends MoveTo {
    run(): void {
        const shootable = this.unit.getClosestShootable();
        if (shootable && this.unit.canShoot()) {
            this.unit.shoot(shootable);
        } else {
            this.unit.moveTowards(this.goal);
        }
    }
}
