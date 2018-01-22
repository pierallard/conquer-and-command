import {Attack} from "./Attack";
import {Orca} from "../unit/Orca";
import {Helipad} from "../building/Helipad";
import {Distance} from "../computing/Distance";

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
                const closestPoint = Distance.getClosestPosition(
                    this.unit.getCellPositions()[0],
                    closestHelipad.getCellPositions()
                );
                this.unit.moveTowards(closestPoint);
            }
        }
    }

    private getClosestHelipad() {
        return this.worldKnowledge.getPlayerArmies(this.unit.getPlayer(), 'Helipad').filter((helipad) => {
            return !(<Helipad> helipad).isLoading();
        })[0];
    }
}
