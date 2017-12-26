import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {AbstractCreator} from "./AbstractCreator";
import {BuildingProperties} from "../building/BuildingProperties";

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

    abstract getSpriteKey(itemName: string): string;

    abstract getSpriteLayer(itemName: string): number;

    abstract onClickFunction(itemName: string);

    abstract onProductFinish(itemName: string);

    abstract getConstructionTime(itemName: string): number;

    create(game: Phaser.Game, group: Phaser.Group, creator: AbstractCreator) {
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
                this.getSpriteLayer(item),
                this.onClickFunction,
                this.onProductFinish
            ));
            top += HEIGHT * SCALE;
        });
        creator.create(game, this);
    }

    updateAlloweds(allowedItems: string[]) {
        this.buttons.forEach((button) => {
            if (allowedItems.indexOf(button.getName()) > -1) {
                button.show();
            } else {
                button.hide();
            }
        });
    }

    resetButton(itemName: string) {
        this.getButton(itemName).reset();
    }

    setPendingButton(itemName: string) {
        this.getButton(itemName).setPending();
    }

    private getButton(itemName: string): CreationButton {
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].getName() === itemName) {
                return this.buttons[i];
            }
        }

        return null;
    }

    runProduction(itemName: string) {
        this.getButton(itemName).runProduction(this.getConstructionTime(itemName));
    }

    getPlayer(): Player {
        return this.player;
    }
}

class CreationButton {
    private progress: CreationButtonProgress;
    private itemName: string;
    private button: Phaser.Sprite;
    private itemSprite: Phaser.Sprite;
    private onProductFinished: any;
    private creator: AbstractUICreator;

    constructor(
        creator: AbstractUICreator,
        game: Phaser.Game,
        top: number,
        itemName: string,
        group: Phaser.Group,
        x: number,
        spriteKey: string,
        spriteLayer: number,
        onClickFunction: any,
        onProductFinished: any
    ) {
        this.itemName = itemName;
        this.onProductFinished = onProductFinished;
        this.creator = creator;

        this.button = new Phaser.Sprite(game, x, top, 'buttons', 0);
        this.button.scale.setTo(SCALE, SCALE);
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(() => {
            onClickFunction.bind(creator)(this.itemName);
        }, creator);
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

    runProduction(constructionTime) {
        this.button.loadTexture(this.button.key, 1);
        const tween = this.progress.startProgress(constructionTime * Phaser.Timer.SECOND);
        tween.onComplete.add(() => {
            this.onProductFinished.bind(this.creator)(this.itemName);
        }, this.creator);
    }

    getName() {
        return this.itemName;
    }

    reset() {
        this.progress.resetProgress();
        this.button.loadTexture(this.button.key, 0);
    }

    setPending() {
        this.button.loadTexture(this.button.key, 2);
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

    startProgress(time: number): Phaser.Tween {
        return this.game.add.tween(this.cropRect).to({ width: WIDTH }, time, "Linear", true);
    }

    resetProgress() {
        this.cropRect.width = 0;
        this.crop(this.myCropRect, false);
    }
}
