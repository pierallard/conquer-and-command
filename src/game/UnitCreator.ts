import {SCALE} from "./game_state/Play";
import {BuildingRepository} from "./repository/BuildingRepository";

const X = 1202;
const WIDTH = 33;
const HEIGHT = 28;
const UNITS = {
    'Tank': 'Tank11',
    'Harvester': 'Builder2'
};

export class UnitCreator {
    private buildingRepository: BuildingRepository;

    constructor(game: Phaser.Game, group: Phaser.Group, buildingRepository: BuildingRepository) {
        this.buildingRepository = buildingRepository;

        let top = 250;
        Object.keys(UNITS).forEach((unit) => {
            let cellTank = new Phaser.Sprite(game, X, top, 'buttons', 0);
            cellTank.scale.setTo(SCALE, SCALE);
            cellTank.inputEnabled = true;
            cellTank.events.onInputDown.add(() => {
                let creator = this.buildingRepository.getCreatorOf(unit);
                if (null !== creator) {
                    creator.build(unit);
                }
            }, this);
            group.add(cellTank);

            let tank = new Phaser.Sprite(game, X + WIDTH * SCALE / 2, top + HEIGHT * SCALE / 2, UNITS[unit], 6);
            tank.scale.setTo(SCALE, SCALE);
            tank.anchor.setTo(0.5, 0.5);

            top += HEIGHT * SCALE;
            group.add(tank);
        });
    }
}
