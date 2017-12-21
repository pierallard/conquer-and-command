///<reference path="BuildingPositionner.ts"/>
import {SCALE} from "./game_state/Play";
import {BuildingPositionner} from "./BuildingPositionner";
import {UnitRepository} from "./repository/UnitRepository";
import {BuildingRepository} from "./repository/BuildingRepository";

const X = 1202 - 66;
const WIDTH = 33;
const HEIGHT = 28;

const BUILDINGS = {
    'Power': 'Factory2'
};

export class BuildingCreator {
    constructor(game: Phaser.Game, group: Phaser.Group, unitRepository: UnitRepository, buildingRepository: BuildingRepository) {
        let top = 250;
        Object.keys(BUILDINGS).forEach((building) => {
            let button = new Phaser.Sprite(game, X, top, 'buttons', 0);
            button.scale.setTo(SCALE, SCALE);
            button.inputEnabled = true;
            button.events.onInputDown.add(() => {
                new BuildingPositionner(
                    game,
                    [new PIXI.Point(0,0), new PIXI.Point(1,0), new PIXI.Point(0,1), new PIXI.Point(1,1)],
                    unitRepository,
                    buildingRepository
                );
            }, this);
            group.add(button);

            let buildingSprite = new Phaser.Sprite(game, X + WIDTH * SCALE / 2, top + HEIGHT * SCALE / 2, BUILDINGS[building], 0);
            buildingSprite.scale.setTo(SCALE / 2, SCALE / 2);
            buildingSprite.anchor.setTo(0.5, 0.7);

            top += HEIGHT * SCALE;
            group.add(buildingSprite);
        });
    }
}
