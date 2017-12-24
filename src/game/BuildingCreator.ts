import {SCALE} from "./game_state/Play";
import {BuildingPositionner} from "./BuildingPositionner";
import {PowerPlant} from "./building/PowerPlant";
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

    update() {
        this.buildingButtons.forEach((buildingButton) => {
            let foundAll = true;
            BuildingProperties.getAllowedBuildings(buildingButton.getName()).forEach((buildingName) => {
                let found = false;
                this.worldKnowledge.getBuildings().forEach((existingBuilding) => {
                    if (existingBuilding.constructor.name === buildingName) {
                        found = true;
                    }
                });
                if (!found) {
                    foundAll = false;
                }
            });
            if (!foundAll) {
                buildingButton.hide();
            } else {
                buildingButton.show();
            }
        });
    }

    build(buildingName: string, cellPosition: PIXI.Point) {
        if (buildingName === 'PowerPlant') {
            let newBuilding = new PowerPlant(cellPosition, this.player);
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
    private button: Phaser.Sprite;
    private buildingSprite: Phaser.Sprite;

    constructor(
        buildingCreator: BuildingCreator,
        game: Phaser.Game,
        top: number,
        buildingName: string,
        group: Phaser.Group
    ) {
        this.state = STATE.AVAILABLE;
        this.buildingName = buildingName;

        this.button = new Phaser.Sprite(game, X, top, 'buttons', 0);
        this.button.scale.setTo(SCALE, SCALE);
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(() => {
            if (this.state === STATE.AVAILABLE) {
                this.state = STATE.PROGRESS;
                this.button.loadTexture(this.button.key, 1);
                const tween = this.progress.startProgress();
                tween.onComplete.add(() => {
                    this.state = STATE.CONSTRUCTABLE;
                    this.button.loadTexture(this.button.key, 2);
                });
            } else if (this.state === STATE.CONSTRUCTABLE) {
                this.state = STATE.PROGRESS;
                this.button.loadTexture(this.button.key, 0);
                buildingCreator.createPositionner(this.buildingName);
            }
        }, this);
        group.add(this.button);

        this.buildingSprite = new Phaser.Sprite(
            game,
            X + WIDTH * SCALE / 2,
            top + HEIGHT * SCALE / 2,
            BuildingProperties.getSpriteKey(buildingName),
            BuildingProperties.getSpriteLayer(buildingName)
        );
        this.buildingSprite.scale.setTo(SCALE / 2, SCALE / 2);
        this.buildingSprite.anchor.setTo(0.5, 0.7);
        group.add(this.buildingSprite);

        this.progress = new BuildingButtonProgress(game, top);
        group.add(this.progress);

        this.hide();
    }

    getName() {
        return this.buildingName;
    }

    reset() {
        this.state = STATE.AVAILABLE;
        this.progress.resetProgress();
    }

    hide() {
        this.button.alpha = 0;
        this.buildingSprite.alpha = 0;
        this.progress.alpha = 0;
    }

    show() {
        this.button.alpha = 1;
        this.buildingSprite.alpha = 1;
        this.progress.alpha = 1;
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
