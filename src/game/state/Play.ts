import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../Ground";


export const SCALE = 2;
export const CIRCLE_RADIUS: number = 19 * SCALE;

export default class Play extends Phaser.State
{
    private unitRepository: UnitRepository;
    private selector: Selector;
    private ground: Ground;

    public create()
    {
        this.ground = new Ground(this);
        this.unitRepository = new UnitRepository(this);
        this.unitRepository.generateRandomUnits();
        this.selector = new Selector(this.game, this.unitRepository);
        this.game.add.existing(this.selector);
    }

    public update()
    {
        this.unitRepository.update();
    }
}
