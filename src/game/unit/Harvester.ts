import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {Harvest} from "../state/Harvest";
import {Cube} from "../building/Cube";
import {ConstructionYard} from "../building/ConstructionYard";
import {Distance} from "../Distance";
import {CubeSet} from "../building/CubeSet";
import {UnitProperties} from "./UnitProperties";
import {WorldKnowledge} from "../WorldKnowledge";

export class Harvester extends Unit {
    private loading: number;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(
            worldKnowledge,
            cellPosition,
            player,
            UnitProperties.getSprite(Harvester.prototype.constructor.name, player.getId())
        );

        this.life = this.maxLife = UnitProperties.getLife(Harvester.prototype.constructor.name);
        this.loading = 0;
    }

    updateStateAfterclick(cell: PIXI.Point) {
        const unit = this.worldKnowledge.getUnitAt(cell);
        if (null !== unit) {
            if (this.getPlayer() !== unit.getPlayer()) {
                this.state = new Attack(this, unit);
            } else {
                this.state = new Follow(this, unit);
            }
        } else {
            const building = this.worldKnowledge.getBuildingAt(cell);
            if (building && building instanceof CubeSet) {
                this.state = new Harvest(this, (<CubeSet> building));
            } else {
                this.state = new MoveAttack(this, cell);
            }
        }
    }

    getClosestBase() {
        return Distance.getClosest(this.getCellPositions()[0], this.player.getConstructionYards());
    }

    getClosestCube(cubeSet: CubeSet) {
        return Distance.getClosest(this.getCellPositions()[0], cubeSet.getCubes());
    }

    isFull() {
        return this.loading >= UnitProperties.getOption(this.constructor.name, 'max_loading');
    }

    unload(base: ConstructionYard) {
        base.addMinerals(this.loading);
        this.loading = 0;

        this.freeze(UnitProperties.getOption(this.constructor.name, 'unload_time') * Phaser.Timer.SECOND);
    }

    load(cube: Cube) {
        this.unitSprite.doLoad(cube.getCellPositions()[0]);
        this.loading += cube.harvest();

        this.freeze(UnitProperties.getOption(this.constructor.name, 'load_time') * Phaser.Timer.SECOND);
    }

    isLoaded() {
        return this.loading > 0;
    }
}
