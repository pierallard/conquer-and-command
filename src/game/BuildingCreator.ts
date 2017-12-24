import {SCALE} from "./game_state/Play";
import {BuildingPositionner} from "./BuildingPositionner";
import {Power} from "./building/Power";
import {Player} from "./player/Player";
import {BuildingProperties} from "./building/BuildingProperties";
import {WorldKnowledge} from "./WorldKnowledge";

const X = 1202 - 66;
const WIDTH = 33;
const HEIGHT = 36;

export class BuildingCreator {
    private player: Player;
    private buildingButtons: BuildingButton[];
    private worldKnowledge: WorldKnowledge;
    private buildingPositionner: BuildingPositionner;

    constructor(worldKnowledge: WorldKnowledge, player: Player, buildingPositionner: BuildingPositionner) {
        this.buildingButtons = [];
        this.player = player;
        this.worldKnowledge = worldKnowledge;
        this.buildingPositionner = buildingPositionner;
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        let top = 250;
        BuildingProperties.getConstructableBuildings().forEach((building) => {
            this.buildingButtons.push(new BuildingButton(this, game, top, building, group));
            top += HEIGHT * SCALE;
        });
    }

    build(buildingName: string, cellPosition: PIXI.Point) {
        if (buildingName === 'Power') {
            let newBuilding = new Power(cellPosition, this.player);
            this.worldKnowledge.addBuilding(newBuilding);
        }

        this.buildingButtons.forEach((buildingButton) => {
            if (buildingButton.getName() === buildingName) {
                buildingButton.reset();
            }
        });
    }

    createPositionner(building) {
        this.buildingPositionner.activate(this, building);
    }
}

enum STATE {
    AVAILABLE,
    PROGRESS,
    CONSTRUCTABLE
}

class BuildingButton {
    private state: STATE;
    private progress: BuildingButtonProgress;
    private buildingName: string;

    constructor(
        buildingCreator: BuildingCreator,
        game: Phaser.Game,
        top: number,
        buildingName: string,
        group: Phaser.Group
    ) {
        this.state = STATE.AVAILABLE;
        this.buildingName = buildingName;

        let button = new Phaser.Sprite(game, X, top, 'buttons', 0);
        button.scale.setTo(SCALE, SCALE);
        button.inputEnabled = true;
        button.events.onInputDown.add(() => {
            if (this.state === STATE.AVAILABLE) {
                this.state = STATE.PROGRESS;
                button.loadTexture(button.key, 1);
                const tween = this.progress.startProgress();
                tween.onComplete.add(() => {
                    this.state = STATE.CONSTRUCTABLE;
                    button.loadTexture(button.key, 2);
                });
            } else if (this.state === STATE.CONSTRUCTABLE) {
                this.state = STATE.PROGRESS;
                button.loadTexture(button.key, 0);
                buildingCreator.createPositionner(this.buildingName);
            }
        }, this);
        group.add(button);

        let buildingSprite = new Phaser.Sprite(
            game,
            X + WIDTH * SCALE / 2,
            top + HEIGHT * SCALE / 2,
            BuildingProperties.getSpriteKey(buildingName),
            BuildingProperties.getSpriteLayer(buildingName)
        );
        buildingSprite.scale.setTo(SCALE / 2, SCALE / 2);
        buildingSprite.anchor.setTo(0.5, 0.7);
        group.add(buildingSprite);

        this.progress = new BuildingButtonProgress(game, top);
        group.add(this.progress);

    }

    getName() {
        return this.buildingName;
    }

    reset() {
        this.state = STATE.AVAILABLE;
        this.progress.resetProgress();
    }
}

class BuildingButtonProgress extends Phaser.Sprite {
    private myCropRect: Phaser.Rectangle;

    constructor(game: Phaser.Game, top: number) {
        super(
            game,
            X,
            top + 54,
            'button-progress'
        );
        this.scale.setTo(SCALE);
        this.myCropRect = new Phaser.Rectangle(0, 0, 0, 8);
        this.crop(this.myCropRect, false);
    }

    update() {
        this.crop(this.myCropRect, false);
    }

    startProgress(): Phaser.Tween {
        return this.game.add.tween(this.cropRect).to({ width: WIDTH }, 2000, "Linear", true);
    }

    resetProgress() {
        this.cropRect.width = 0;
        this.crop(this.myCropRect, false);
    }
}
