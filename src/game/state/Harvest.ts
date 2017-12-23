import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../AlternativePosition";
import {Harvester} from "../unit/Harvester";
import {Base} from "../building/Base";
import {CubeSet} from "../building/CubeSet";
import {Cube} from "../building/Cube";

export class Harvest implements State {
    private harvester: Harvester;
    private cubeSet: CubeSet;

    constructor(harvester: Harvester, cubeSet: CubeSet) {
        this.harvester = harvester;
        this.cubeSet = cubeSet;
    }

    getNextStep(): State {
        if (this.cubeSet.isEmpty() && !this.harvester.isLoaded()) {
            return new Stand(this.harvester);
        }

        return this;
    }

    run(): void {
        if (this.harvester.isFull()) {
            this.goToBaseAndUnload();
        } else {
            const closestCube = this.harvester.getClosestCube(this.cubeSet);
            if (!closestCube) {
                this.goToBaseAndUnload();
            } else {
                if (this.isArrivedToCube(closestCube)) {
                    this.harvester.load(closestCube);
                } else {
                    this.harvester.moveTowards(closestCube.getCellPositions()[0]);
                }
            }
        }
    }

    private goToBaseAndUnload() {
        const closestBase = this.harvester.getClosestBase();
        if (this.isArrivedToBase(closestBase)) {
            this.harvester.unload(closestBase);
        } else {
            this.harvester.moveTowards(new PIXI.Point(
                closestBase.getCellPositions()[0].x + 1,
                closestBase.getCellPositions()[0].y + 1
            ));
        }
    }

    private isArrivedToCube(cube: Cube): boolean {
        return AlternativePosition.isArrived(
            cube.getCellPositions()[0],
            this.harvester.getCellPositions()[0],
            this.harvester.getPlayer().isPositionAccessible.bind(this.harvester.getPlayer())
        );
    }

    private isArrivedToBase(base: Base): boolean {
        return AlternativePosition.isArrived(
            new PIXI.Point(base.getCellPositions()[0].x + 1, base.getCellPositions()[0].y + 1),
            this.harvester.getCellPositions()[0],
            this.harvester.getPlayer().isPositionAccessible.bind(this.harvester.getPlayer())
        );
    }
}
