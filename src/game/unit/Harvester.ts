import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {Harvest} from "../state/Harvest";
import {TiberiumPlant} from "../sprite/TiberiumPlant";
import {Distance} from "../computing/Distance";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {TiberiumSource} from "../building/TiberiumSource";
import {TiberiumRefinery} from "../building/TiberiumRefinery";

export class Harvester extends Unit {
    private loading: number;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);

        this.loading = 0;
    }

    harvest() {
        const closestGround = Distance.getClosestItem(
            this.getCellPositions()[0],
            this.worldKnowledge.getGrounds()
        );
        this.state = new Harvest(this.worldKnowledge, this, closestGround.getSource());
    }

    updateStateAfterClick(cell: PIXI.Point) {
        const unit = this.worldKnowledge.getGroundArmyAt(cell);
        if (null === unit) {
            const ground = this.worldKnowledge.getGroundAt(cell);
            if (ground && ground instanceof TiberiumPlant) {
                this.state = new Harvest(this.worldKnowledge, this, (<TiberiumPlant> ground).getSource());

                return;
            }
        }

        super.updateStateAfterClick(cell);
    }

    getClosestRefinery(): TiberiumRefinery {
        return Distance.getClosestItem(
            this.getCellPositions()[0],
            this.worldKnowledge.getPlayerArmies(this.player, 'TiberiumRefinery')
        );
    }

    getClosestPlant(source: TiberiumSource) {
        return Distance.getClosestItem(this.getCellPositions()[0], source.getFreePlants(this));
    }

    isFull() {
        return this.loading >= UnitProperties.getOption(this.constructor.name, 'max_loading');
    }

    unload(refinery: TiberiumRefinery) {
        refinery.runUnloadAnimation();
        refinery.getPlayer().addMinerals(this.loading);
        this.loading = 0;

        this.freeze(UnitProperties.getOption(this.constructor.name, 'unload_time') * Phaser.Timer.SECOND);
    }

    load(cube: TiberiumPlant) {
        this.unitSprite.doLoad(cube.getCellPositions()[0]);
        this.loading += cube.harvest();

        this.freeze(UnitProperties.getOption(this.constructor.name, 'load_time') * Phaser.Timer.SECOND);
    }

    isLoaded() {
        return this.loading > 0;
    }
}
