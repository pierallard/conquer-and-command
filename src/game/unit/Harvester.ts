import {Unit} from "./Unit";
import {Player} from "../player/Player";
import {Attack} from "../state/Attack";
import {Follow} from "../state/Follow";
import {MoveAttack} from "../state/MoveAttack";
import {Harvest} from "../state/Harvest";
import {Cube} from "../building/Cube";
import {Base} from "../building/Base";

const MAX_LOADING = 50;
const UNLOAD_TIME = Phaser.Timer.SECOND;
const LOAD_TIME = Phaser.Timer.SECOND;

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
            if (building && building instanceof Cube) {
                this.state = new Harvest(this, (<Cube> building));
            } else {
                this.state = new MoveAttack(this, cell);
            }
        }
    }

    getClosestBase() {
        const bases = this.player.getBases();
        console.log(bases);
        let minDistance = null;
        let closest = null;
        for (let i = 0; i < bases.length; i++) {
            const base = (<Base> bases[i]);
            const distance = this.distanceTo(base);
            if (null === closest || minDistance > distance) {
                minDistance = distance;
                closest = base;
            }
        }

        return closest;
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
        this.rotateTowards(cube.getCellPosition());
        this.loading += cube.harvest();

        this.freeze(LOAD_TIME);
    }
}
