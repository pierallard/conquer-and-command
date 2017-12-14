import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";
import {Cube} from "../building/Cube";
import {Harvester} from "../unit/Harvester";
import {Base} from "../building/Base";

export class Harvest implements State {
    private harvester: Harvester;
    private cube: Cube;

    constructor(harvester: Harvester, cube: Cube) {
        this.harvester = harvester;
        this.cube = cube;
    }

    getNextStep(): State {
        if (this.cube.isEmpty()) {
            return new Stand(this.harvester);
        }

        return this;
    }

    run(): void {
        if (this.harvester.isFull()) {
            const closestBase = this.harvester.getClosestBase();
            if (this.isArrivedToBase(closestBase)) {
                this.harvester.unload(closestBase);
            } else {
                this.harvester.moveTowards(new PIXI.Point(closestBase.getCellPosition().x + 1, closestBase.getCellPosition().y + 1));
            }
        } else {
            if (this.isArrivedToCube()) {
                this.harvester.load(this.cube);
            } else {
                this.harvester.moveTowards(this.cube.getCellPosition());
            }
        }
    }

    private isArrivedToCube(): boolean
    {
        return AlternativePosition.isArrived(
            this.cube.getCellPosition(),
            this.harvester.getCellPosition(),
            this.harvester.getPlayer().isPositionAccessible.bind(this.harvester.getPlayer())
        );
    }

    private isArrivedToBase(base: Base): boolean
    {
        return AlternativePosition.isArrived(
            new PIXI.Point(base.getCellPosition().x + 1, base.getCellPosition().y + 1),
            this.harvester.getCellPosition(),
            this.harvester.getPlayer().isPositionAccessible.bind(this.harvester.getPlayer())
        );
    }
}
