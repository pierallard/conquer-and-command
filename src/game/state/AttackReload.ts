import {Attack} from "./Attack";
import {Orca} from "../unit/Orca";

export class AttackReload extends Attack {
    run(): void {
        if ((<Orca> this.unit).isOnHelipad()) {
            if ((<Orca> this.unit).isFullyReloaded()) {
                super.run();
            } else {
                (<Orca> this.unit).reload();
            }
        } else if (this.unit.canShoot()) {
            super.run();
        } else {
            const closestHelipad = this.getClosestHelipad();
            if (closestHelipad) {
                this.unit.moveTowards(closestHelipad.getCellPositions()[0]);
            }
        }
    }

    private getClosestHelipad() {
        // TODO It only get the first one
        return this.worldKnowledge.getPlayerArmies(this.unit.getPlayer(), 'Helipad')[0];
    }
}
