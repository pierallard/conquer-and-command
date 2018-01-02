import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {AbstractCreator} from "./AbstractCreator";

const WIDTH = 33;
const HEIGHT = 36;
const TOP = 244;

export abstract class AbstractUICreator {
    protected player: Player;
    protected worldKnowledge: WorldKnowledge;
    protected buttons: CreationButton[];
    private game: Phaser.Game;
    private group: Phaser.Group;
    private x: number;
    private bottomButton: Phaser.Sprite;
    private topButton: Phaser.Sprite;
    private index: number;

    constructor(worldKnowledge: WorldKnowledge, player: Player, x: number) {
        this.buttons = [];
        this.player = player;
        this.worldKnowledge = worldKnowledge;
        this.x = x;
        this.index = 0;
    }

    abstract getSpriteKey(itemName: string): string;

    abstract getSpriteLayer(itemName: string): number;

    abstract onClickFunction(itemName: string);

    abstract onProductFinish(itemName: string);

    abstract getConstructionTime(itemName: string): number;

    create(game: Phaser.Game, group: Phaser.Group, creator: AbstractCreator) {
        this.game = game;
        this.group = group;

        this.bottomButton = new Phaser.Sprite(game, this.x + 3 * 2, 305 * 2, 'interfacebuttons', 3);
        this.bottomButton.scale.setTo(SCALE);
        this.bottomButton.events.onInputDown.add(() => {
            this.goDown();
        }, this);
        this.topButton = new Phaser.Sprite(game, this.x + 18 * 2, 305 * 2, 'interfacebuttons', 2);
        this.topButton.scale.setTo(SCALE);
        this.topButton.events.onInputDown.add(() => {
            this.goUp();
        }, this);

        group.add(this.bottomButton);
        group.add(this.topButton);

        creator.create(game, this);
    }

    updateAllowedItems(allowedItems: string[]) {
        this.createButtons(allowedItems);
        this.buttons.forEach((button) => {
            button.setAllowed(allowedItems.indexOf(button.getName()) > -1);
        });
    }

    updateBuyableItems(buyableItems: string[]) {
        this.buttons.forEach((button) => {
            button.allowConstruct(buyableItems.indexOf(button.getName()) > -1);
        });
    }

    resetButton(itemName: string) {
        this.getButton(itemName).reset();
    }

    setPendingButton(itemName: string) {
        this.getButton(itemName).setPending();
    }

    runProduction(itemName: string) {
        this.getButton(itemName).runProduction(this.getConstructionTime(itemName));
    }

    getPlayer(): Player {
        return this.player;
    }

    static getUIText(itemName: string) {
        return itemName.split('').reduce((previousText, letter) => {
            if (/^[A-Z]$/.test(letter)) {
                if (previousText !== '') {
                    return previousText + "\n" + letter;
                } else {
                    return letter;
                }
            } else {
                return previousText + letter;
            }
        }, '');
    }

    private createButton(itemName: string) {
        this.buttons.push(new CreationButton(
            this,
            this.game,
            TOP + this.buttons.length * HEIGHT * SCALE,
            itemName,
            this.group,
            this.x,
            this.getSpriteKey(itemName),
            this.getSpriteLayer(itemName),
            this.onClickFunction,
            this.onProductFinish
        ));
    }

    private getButton(itemName: string): CreationButton {
        for (let i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].getName() === itemName) {
                return this.buttons[i];
            }
        }

        return null;
    }

    private goDown() {
        this.index += 1;
        this.buttons.forEach((button) => {
            button.goUp();
        });
        this.updateVisibleButtons();
    }

    private goUp() {
        this.index -= 1;
        this.buttons.forEach((button) => {
            button.goDown();
        });
        this.updateVisibleButtons();
    }

    private updateVisibleButtons() {
        let displayTop = false;
        let displayBottom = false;
        for (let i = 0; i < this.buttons.length; i++) {
            if (i < this.index) {
                this.buttons[i].setVisible(false);
                displayTop = true;
            } else if (i > this.index + 4) {
                this.buttons[i].setVisible(false);
                displayBottom = true;
            } else {
                this.buttons[i].setVisible(true);
            }
        }

        this.topButton.loadTexture(this.topButton.key, displayTop ? 0 : 2);
        this.topButton.inputEnabled = displayTop;

        this.bottomButton.loadTexture(this.bottomButton.key, displayBottom ? 1 : 3);
        this.bottomButton.inputEnabled = displayBottom;
    }

    private createButtons(itemNames: string[]) {
        itemNames.forEach((itemName) => {
            if (!this.buttons.some((button) => {
                    return button.getName() === itemName;
                })) {
                this.createButton(itemName);
            }
        });
        this.updateVisibleButtons();
    }
}

class CreationButton {
    private progress: CreationButtonProgress;
    private itemName: string;
    private button: Phaser.Sprite;
    private itemSprite: Phaser.Sprite;
    private onProductFinished: any;
    private uiCreator: AbstractUICreator;
    private constructAllowed: boolean;
    private text: Phaser.Text;

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
        this.uiCreator = creator;

        this.button = new Phaser.Sprite(game, x, top, 'buttons', 2);
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

        this.text = new Phaser.Text(
            game,
            x,
            top,
            AbstractUICreator.getUIText(this.itemName),
            { align: 'center', fill: "#ffffff", font: '14px 000webfont' }
        );
        group.add(this.text);

        this.progress = new CreationButtonProgress(game, top, x);
        group.add(this.progress);

        this.constructAllowed = true;
    }

    runProduction(constructionTime) {
        this.button.loadTexture(this.button.key, 3);
        const tween = this.progress.startProgress(constructionTime * Phaser.Timer.SECOND);
        tween.onComplete.add(() => {
            this.onProductFinished.bind(this.uiCreator)(this.itemName);
        }, this.uiCreator);
    }

    getName() {
        return this.itemName;
    }

    reset() {
        this.progress.resetProgress();
        if (this.constructAllowed) {
            this.button.loadTexture(this.button.key, 2);
        } else {
            this.button.loadTexture(this.button.key, 0);
        }
    }

    setPending() {
        this.button.loadTexture(this.button.key, 3);
    }

    allowConstruct(value: boolean) {
        this.constructAllowed = value;
        if (!value) {
            if (this.button.frame === 2) {
                this.button.loadTexture(this.button.key, 0);
            }
        } else {
            this.button.loadTexture(this.button.key, 2);
        }
    }

    setAllowed(value: boolean): void {
        this.applyAllElement((element) => {
            element.alpha = value ? 1 : 0.5;
        });
    }

    setVisible(value: boolean): void {
        this.applyAllElement((element) => {
            element.visible = value;
        });
    }

    goDown() {
        this.applyAllElement((element) => {
            element.y = element.y + HEIGHT * SCALE;
        });
    }

    goUp() {
        this.applyAllElement((element) => {
            element.y = element.y - HEIGHT * SCALE;
        });
    }

    private applyAllElement(a: any) {
        [this.button, this.itemSprite, this.progress, this.text].forEach((element) => {
            a(element);
        });
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
