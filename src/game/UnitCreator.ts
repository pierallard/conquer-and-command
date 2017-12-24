import {SCALE} from "./game_state/Play";
import {WorldKnowledge} from "./WorldKnowledge";
import {Tank} from "./unit/Tank";
import {Building} from "./building/Building";
import {Player} from "./player/Player";

const X = 1202;
const WIDTH = 33;
const HEIGHT = 36;
const UNITS = {
    'Tank': 'Tank11',
    'Harvester': 'Builder2',
};

export class UnitCreator {
    private worldKnowledge: WorldKnowledge;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        let top = 250;
        Object.keys(UNITS).forEach((unitName) => {
            let button = new Phaser.Sprite(game, X, top, 'buttons', 0);
            button.scale.setTo(SCALE, SCALE);
            button.inputEnabled = true;
            button.events.onInputDown.add(() => {
                let creator = this.worldKnowledge.getCreatorOf(unitName);
                if (null !== creator) {
                    this.createNewUnit(unitName, creator);
                }
            }, this);
            group.add(button);

            let unitSprite = new Phaser.Sprite(
                game, X + WIDTH * SCALE / 2,
                top + HEIGHT * SCALE / 2,
                UNITS[unitName],
                6
            );
            unitSprite.scale.setTo(SCALE, SCALE);
            unitSprite.anchor.setTo(0.5, 0.5);

            top += HEIGHT * SCALE;
            group.add(unitSprite);
        });
    }

    private createNewUnit(unitName: string, creator: Building) {
        // TODO Set read unit
        let newUnit = new Tank(this.worldKnowledge, creator.getCellPositions()[0], this.player);
        this.worldKnowledge.addUnit(newUnit);
    }
}
