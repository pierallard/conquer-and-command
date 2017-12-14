import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../Ground";
import {Player} from "../Player";


export const SCALE = 1.5;
export const CIRCLE_RADIUS: number = 19 * SCALE;

export default class Play extends Phaser.State
{
    private unitRepository: UnitRepository;
    private selector: Selector;
    private players: Player[];
    public ground: Ground;

    public create()
    {
        this.players = [
            new Player('Tank11'),
            new Player('Tank12'),
        ];
        this.ground = new Ground(this);
        this.unitRepository = new UnitRepository(this);
        this.unitRepository.generateRandomUnits(this.players);
        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);
        this.game.add.existing(this.selector);
    }

    public update()
    {
    }
}
