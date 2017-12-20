import {SCALE} from "./game_state/Play";
import {BuildingRepository} from "./repository/BuildingRepository";

const X = 1200;

export class UnitCreator {
    private buildingRepository: BuildingRepository;

    constructor(game: Phaser.Game, group: Phaser.Group, buildingRepository: BuildingRepository) {
        let tank = new Phaser.Sprite(game, X, 250, 'Tank11', 6);
        tank.scale.setTo(SCALE, SCALE);
        tank.inputEnabled = true;
        tank.events.onInputDown.add(() => {
            this.buildingRepository.getCreatorOf('Tank11').build('Tank11');
        }, this);

        this.buildingRepository = buildingRepository;

        group.add(tank);
    }
}
