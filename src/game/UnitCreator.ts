import {SCALE} from "./game_state/Play";
import {BuildingRepository} from "./repository/BuildingRepository";

const X = 1202;
const WIDTH = 33;
const HEIGHT = 28;

export class UnitCreator {
    private buildingRepository: BuildingRepository;

    constructor(game: Phaser.Game, group: Phaser.Group, buildingRepository: BuildingRepository) {
        const top = 250;

        let cellTank = new Phaser.Sprite(game, X, top, 'buttons', 0);
        cellTank.scale.setTo(SCALE, SCALE);
        cellTank.inputEnabled = true;
        cellTank.events.onInputDown.add(() => {
            this.buildingRepository.getCreatorOf('Tank').build('Tank');
        }, this);
        group.add(cellTank);

        let tank = new Phaser.Sprite(game, X + WIDTH * SCALE / 2, top + HEIGHT * SCALE / 2, 'Tank11', 6);
        tank.scale.setTo(SCALE, SCALE);
        tank.anchor.setTo(0.5, 0.5);

        this.buildingRepository = buildingRepository;

        group.add(tank);
    }
}
