import {State} from "./State";
import {Stand} from "./Stand";
import {AlternativePosition} from "../computing/AlternativePosition";
import {Harvester} from "../unit/Harvester";
import {ConstructionYard} from "../building/ConstructionYard";
import {TiberiumPlant} from "../sprite/TiberiumPlant";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {TiberiumSource} from "../building/TiberiumSource";
import {TiberiumRefinery} from "../building/TiberiumRefinery";

export class Harvest implements State {
    private worldKnowledge: WorldKnowledge;
    private harvester: Harvester;
    private source: TiberiumSource;

    constructor(worldKnowledge: WorldKnowledge, harvester: Harvester, source: TiberiumSource) {
        this.worldKnowledge = worldKnowledge;
        this.harvester = harvester;
        this.source = source;
    }

    getNextStep(): State {
        if (null === this.harvester.getClosestRefinery()) {
            return new Stand(this.harvester);
        }
        if (this.source.isEmpty() && !this.harvester.isLoaded()) {
            return new Stand(this.harvester);
        }

        return this;
    }

    run(): void {
        if (this.harvester.isFull()) {
            this.goToBaseAndUnload();
        } else {
            const closestPlant = this.harvester.getClosestPlant(this.source);
            if (!closestPlant) {
                this.goToBaseAndUnload();
            } else {
                if (this.isArrivedToPlant(closestPlant)) {
                    this.harvester.load(closestPlant);
                } else {
                    this.harvester.moveTowards(closestPlant.getCellPositions()[0]);
                }
            }
        }
    }

    private goToBaseAndUnload() {
        const closestRefinery = this.harvester.getClosestRefinery();
        if (null !== closestRefinery) {
            if (this.isArrivedToRefinery(closestRefinery)) {
                this.harvester.unload(closestRefinery);
            } else {
                this.harvester.moveTowards(new PIXI.Point(
                    closestRefinery.getCellPositions()[0].x + 1,
                    closestRefinery.getCellPositions()[0].y + 1
                ));
            }
        }
    }

    private isArrivedToPlant(plant: TiberiumPlant): boolean {
        return plant.getCellPositions()[0].x === this.harvester.getCellPositions()[0].x &&
            plant.getCellPositions()[0].y === this.harvester.getCellPositions()[0].y;
    }

    private isArrivedToRefinery(refinery: TiberiumRefinery): boolean {
        return AlternativePosition.isArrived(
            refinery.getCellPositions()[0],
            this.harvester.getCellPositions()[0],
            this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge)
        );
    }
}
