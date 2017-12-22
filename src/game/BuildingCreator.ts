///<reference path="BuildingPositionner.ts"/>
import {SCALE} from "./game_state/Play";
import {BuildingPositionner} from "./BuildingPositionner";
import {UnitRepository} from "./repository/UnitRepository";
import {BuildingRepository} from "./repository/BuildingRepository";
import {Power} from "./building/Power";
import {Player} from "./player/Player";

const X = 1202 - 66;
const WIDTH = 33;
const HEIGHT = 28;

const BUILDINGS = {
    'Power': 'Factory2'
};

export class BuildingCreator {
    private game: Phaser.Game;
    private buildingRepository: BuildingRepository;
    private player: Player;

    constructor(game: Phaser.Game, group: Phaser.Group, unitRepository: UnitRepository, buildingRepository: BuildingRepository, player:Player) {
        this.game = game;
        this.buildingRepository = buildingRepository;
        this.player = player;

        let top = 250;
        Object.keys(BUILDINGS).forEach((building) => {
            let button = new Phaser.Sprite(game, X, top, 'buttons', 0);
            button.scale.setTo(SCALE, SCALE);
            button.inputEnabled = true;
            button.events.onInputDown.add(() => {
                new BuildingPositionner(
                    this,
                    game,
                    [new PIXI.Point(0,0), new PIXI.Point(1,0), new PIXI.Point(0,1), new PIXI.Point(1,1)],
                    unitRepository,
                    buildingRepository,
                    building
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

    build(buildingName: string, cellX: number, cellY: number) {
        if (buildingName === 'Power') {
            this.buildingRepository.add(new Power(
                this.game,
                cellX,
                cellY,
                this.buildingRepository.getGroup(),
                this.player
            ));
        }
    }
}
