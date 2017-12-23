import {SCALE} from "./game_state/Play";
import {BuildingRepository} from "./repository/BuildingRepository";

const X = 1202;
const WIDTH = 33;
const HEIGHT = 28;
const UNITS = {
    'Tank': 'Tank11',
    'Harvester': 'Builder2',
};

export class UnitCreator {
    private buildingRepository: BuildingRepository;

    constructor(game: Phaser.Game, group: Phaser.Group, buildingRepository: BuildingRepository) {
        this.buildingRepository = buildingRepository;

        let top = 250;
        Object.keys(UNITS).forEach((unit) => {
            let button = new Phaser.Sprite(game, X, top, 'buttons', 0);
            button.scale.setTo(SCALE, SCALE);
            button.inputEnabled = true;
            button.events.onInputDown.add(() => {
                let creator = this.buildingRepository.getCreatorOf(unit);
                if (null !== creator) {
                    creator.build(unit);
                }
            }, this);
            group.add(button);

            let unitSprite = new Phaser.Sprite(game, X + WIDTH * SCALE / 2, top + HEIGHT * SCALE / 2, UNITS[unit], 6);
            unitSprite.scale.setTo(SCALE, SCALE);
            unitSprite.anchor.setTo(0.5, 0.5);

            top += HEIGHT * SCALE;
            group.add(unitSprite);
        });
    }
}
