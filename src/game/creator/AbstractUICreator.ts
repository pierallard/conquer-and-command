import {Player} from "../player/Player";
import {WorldKnowledge} from "../WorldKnowledge";
import {SCALE} from "../game_state/Play";

const WIDTH = 33;
const HEIGHT = 36;

export abstract class AbstractUICreator {
    protected player: Player;
    protected worldKnowledge: WorldKnowledge;
    protected buttons: CreationButton[];
    private x: number;

    constructor(worldKnowledge: WorldKnowledge, player: Player, x: number) {
        this.buttons = [];
        this.player = player;
        this.worldKnowledge = worldKnowledge;
        this.x = x;
    }

    abstract getConstructableItems(): string[];

    abstract getAllowedItems(name: string): string[];

    abstract construct(itemName: string);

    abstract getSpriteKey(itemName: string): string;

    abstract getSpriteLayer(itemName: string): number;

    create(game: Phaser.Game, group: Phaser.Group) {
        let top = 250;
        this.getConstructableItems().forEach((item) => {
            this.buttons.push(new CreationButton(
                this,
                game,
                top,
                item,
                group,
                this.x,
                this.getSpriteKey(item),
                this.getSpriteLayer(item)
            ));
            top += HEIGHT * SCALE;
        });
    }

    update() {
        this.buttons.forEach((button) => {
            let foundAll = true;
            this.getAllowedItems(button.getName()).forEach((itemName) => {
                let found = false;
                this.worldKnowledge.getPlayerBuildings(this.player).forEach((existingBuilding) => {
                    if (existingBuilding.constructor.name === itemName) {
                        found = true;
                    }
                });
                if (!found) {
                    foundAll = false;
                }
            });
            if (!foundAll) {
                button.hide();
            } else {
                button.show();
            }
        });
    }

    resetButton(itemName: string) {
        this.buttons.forEach((button) => {
            if (button.getName() === itemName) {
                button.reset();
            }
        });
    }

}

enum STATE {
    AVAILABLE,
    PROGRESS,
    CONSTRUCTABLE
}

class CreationButton {
    private state: STATE;
    private progress: CreationButtonProgress;
    private itemName: string;
    private button: Phaser.Sprite;
    private itemSprite: Phaser.Sprite;

    constructor(
        creator: AbstractUICreator,
        game: Phaser.Game,
        top: number,
        itemName: string,
        group: Phaser.Group,
        x: number,
        spriteKey: string,
        spriteLayer: number
    ) {
        this.state = STATE.AVAILABLE;
        this.itemName = itemName;

        this.button = new Phaser.Sprite(game, x, top, 'buttons', 0);
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
                creator.construct(this.itemName);
            }
        }, this);
        group.add(this.button);

        this.itemSprite = new Phaser.Sprite(
            game,
            x + WIDTH * SCALE / 2,
            top + HEIGHT * SCALE / 2,
            spriteKey,
            spriteLayer
        );
        this.itemSprite.scale.setTo(SCALE / 2, SCALE / 2);
        this.itemSprite.anchor.setTo(0.5, 0.7);
        group.add(this.itemSprite);

        this.progress = new CreationButtonProgress(game, top, x);
        group.add(this.progress);

        this.hide();
    }

    getName() {
        return this.itemName;
    }

    reset() {
        this.state = STATE.AVAILABLE;
        this.progress.resetProgress();
    }

    hide() {
        this.button.alpha = 0;
        this.itemSprite.alpha = 0;
        this.progress.alpha = 0;
    }

    show() {
        this.button.alpha = 1;
        this.itemSprite.alpha = 1;
        this.progress.alpha = 1;
    }
}

class CreationButtonProgress extends Phaser.Sprite {
    private myCropRect: Phaser.Rectangle;

    constructor(game: Phaser.Game, top: number, x: number) {
        super(
            game,
            x,
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
