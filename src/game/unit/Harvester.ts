import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {Harvest} from "../state/Harvest";
import {Cube} from "../building/Cube";
import {Base} from "../building/Base";
import {Distance} from "../Distance";
import {CubeSet} from "../building/CubeSet";

const MAX_LOADING = 50;
const UNLOAD_TIME = Phaser.Timer.SECOND;
const LOAD_TIME = Phaser.Timer.SECOND;

const SHOOT_DISTANCE = Math.sqrt(2);

export class Harvester extends Unit {
    private loading: number;

    constructor(player: Player, x: number, y: number) {
        super(player, x, y, player.getHarversterKey());

        this.loading = 0;
    }

    updateStateAfterclick(cell: PIXI.Point) {
        const unit = this.player.getUnitRepository().unitAt(cell);
        if (null !== unit) {
            if (this.getPlayer() !== unit.getPlayer()) {
                this.state = new Attack(this, unit);
            } else {
                this.state = new Follow(this, unit);
            }
        } else {
            const building = this.player.getBuildingRepository().buildingAt(cell);
            if (building && building instanceof CubeSet) {
                this.state = new Harvest(this, (<CubeSet> building));
            } else {
                this.state = new MoveAttack(this, cell);
            }
        }
    }

    getClosestBase() {
        return Distance.getClosest(this.getCellPositions()[0], this.player.getBases());
    }

    getClosestCube(cubeSet: CubeSet) {
        return Distance.getClosest(this.getCellPositions()[0], cubeSet.getCubes());
    }

    isFull() {
        return this.loading >= MAX_LOADING;
    }

    unload(base: Base) {
        base.addMinerals(this.loading);
        this.loading = 0;

        this.freeze(UNLOAD_TIME);
    }

    load(cube: Cube) {
        this.unitSprite.doLoad(cube.getCellPositions()[0]);
        this.loading += cube.harvest();

        this.freeze(LOAD_TIME);
    }

    getShootDistance(): number {
        return SHOOT_DISTANCE;
    }

    isLoaded() {
        return this.loading > 0;
    }
}
