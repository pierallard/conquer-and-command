import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Harvester} from "../unit/Harvester";
import {ConstructionYard} from "../building/ConstructionYard";
import {CubeSet} from "../building/CubeSet";
import {Cube} from "../building/Cube";
import {WorldKnowledge} from "../WorldKnowledge";

export class Harvest implements State {
    private worldKnowledge: WorldKnowledge;
    private harvester: Harvester;
    private cubeSet: CubeSet;

    constructor(worldKnowledge: WorldKnowledge, harvester: Harvester, cubeSet: CubeSet) {
        this.worldKnowledge = worldKnowledge;
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
            this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
        );
    }

    private isArrivedToBase(base: ConstructionYard): boolean {
        return AlternativePosition.isArrived(
            new PIXI.Point(base.getCellPositions()[0].x + 1, base.getCellPositions()[0].y + 1),
            this.harvester.getCellPositions()[0],
            this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
        );
    }
}
