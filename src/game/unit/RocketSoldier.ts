import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Shootable} from "../Shootable";
import {UnitProperties} from "./UnitProperties";
import {Distance} from "../computing/Distance";

export class RocketSoldier extends Unit {
    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);
    }

    shoot(enemy: Shootable): void {
        let closestEnemyPosition = Distance.getClosestPosition(this.getCellPositions()[0], enemy.getCellPositions());
        this.unitSprite.doRocketShoot(closestEnemyPosition);
        enemy.lostLife(UnitProperties.getShootPower(this.constructor.name));
        this.freeze(UnitProperties.getShootTime(this.constructor.name) * Phaser.Timer.SECOND);
    }
}
