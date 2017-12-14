import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../Ground";
import {Player} from "../player/Player";

export const SCALE = 1.5;
export const CIRCLE_RADIUS: number = 19 * SCALE;

export default class Play extends Phaser.State {
    private unitRepository: UnitRepository;
    private selector: Selector;
    private players: Player[];
    public ground: Ground;

    public create()
    {
        this.ground = new Ground(this);
        this.unitRepository = new UnitRepository(this);
        this.players = [
            new Player(this.ground, this.unitRepository, 'Tank11'),
            new Player(this.ground, this.unitRepository, 'Tank12'),
        ];

        this.unitRepository.generateRandomUnits(this.players);
        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);
        this.game.add.existing(this.selector);
    }

    public update()
    {
    }
}
