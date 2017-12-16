import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../Ground";
import {Player} from "../player/Player";
import {BuildingRepository} from "../repository/BuildingRepository";

export const SCALE = 1.5;
export const CIRCLE_RADIUS: number = 19 * SCALE;

export default class Play extends Phaser.State {
    private unitRepository: UnitRepository;
    private buildingsRespository: BuildingRepository;
    private selector: Selector;
    private players: Player[];
    public ground: Ground;

    public create()
    {
        this.ground = new Ground(this);
        this.unitRepository = new UnitRepository(this);
        this.buildingsRespository = new BuildingRepository(this);
        this.players = [
            new Player(this.ground, this.unitRepository, this.buildingsRespository, 'Tank11'),
            new Player(this.ground, this.unitRepository, this.buildingsRespository, 'Tank12'),
        ];

        this.unitRepository.generateRandomUnits(this.players);
        this.buildingsRespository.generateRandomBuildings(this.players);
        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);
        this.game.add.existing(this.selector);
    }

    public update()
    {
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
    }
}
