import {Player} from "../player/Player";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {ProductionStatus} from "./AbstractCreator";

const WIDTH = 33;
const HEIGHT = 36;
const TOP = 244;

export abstract class AbstractUICreator {
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

    create(game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.group = group;

        this.bottomButton = new Phaser.Sprite(game, this.x + 3 * 2, 305 * 2, 'interfacebuttons', 3);
        this.bottomButton.scale.setTo(2);
        this.bottomButton.events.onInputDown.add(() => {
            this.goDown();
        }, this);
        this.topButton = new Phaser.Sprite(game, this.x + 18 * 2, 305 * 2, 'interfacebuttons', 2);
        this.topButton.scale.setTo(2);
        this.topButton.events.onInputDown.add(() => {
            this.goUp();
        }, this);

        group.add(this.bottomButton);
        group.add(this.topButton);
    }

    update() {
        this.createButtons(this.getPossibleButtons());

        const productionStatus = this.getProductionStatus();
        this.buttons.forEach((button) => {
            if (productionStatus && button.getName() === productionStatus.getItemName()) {
                button.updateProgress(productionStatus.percentage);
            } else {
                button.setAvailable(this.canProduct(button.getName()));
                button.updateProgress(0);
            }
        });
    }

    getPlayer(): Player {
        return this.player;
    }

    protected abstract getSpriteKey(itemName: string): string;

    protected abstract getSpriteLayer(itemName: string): number;

    protected abstract onClickFunction(itemName: string);

    protected abstract onRightClickFunction(itemName: string);

    protected abstract getPossibleButtons(): string[];

    protected abstract getProductionStatus(): ProductionStatus;

    protected abstract canProduct(itemName: string): boolean;

    private createButton(itemName: string) {
        this.buttons.push(new CreationButton(
            this,
            this.game,
            this.buttons.length > 0 ? this.buttons[this.buttons.length - 1].getTop() + HEIGHT * 2 : TOP,
            itemName,
            this.group,
            this.x,
            this.getSpriteKey(itemName),
            this.getSpriteLayer(itemName),
            this.onClickFunction,
            this.onRightClickFunction
        ));
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
        onRightClickFunction: any
    ) {
        this.itemName = itemName;
        this.uiCreator = creator;

        this.button = new Phaser.Sprite(game, x, top, 'buttons', 2);
        this.button.scale.setTo(2, 2);
        this.button.inputEnabled = true;
        this.button.events.onInputDown.add(() => {
            if (game.input.activePointer.rightButton.isDown) {
                onRightClickFunction.bind(creator)(this.itemName);
            } else {
                onClickFunction.bind(creator)(this.itemName);
            }
        }, creator);
        group.add(this.button);

        this.itemSprite = new Phaser.Sprite(
            game,
            x + WIDTH,
            top + HEIGHT,
            spriteKey,
            spriteLayer
        );
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

    updateProgress(percentage: number) {
        this.setPending(percentage > 0);
        this.progress.setProgress(percentage);
    }

    getName() {
        return this.itemName;
    }

    setPending(value: boolean) {
        this.button.loadTexture(this.button.key, value ? 3 : this.constructAllowed ? 2 : 0);
    }

    setVisible(value: boolean): void {
        this.applyAllElement((element) => {
            element.visible = value;
        });
    }

    goDown() {
        this.applyAllElement((element) => {
            element.y = element.y + HEIGHT * 2;
        });
    }

    goUp() {
        this.applyAllElement((element) => {
            element.y = element.y - HEIGHT * 2;
        });
    }

    setAvailable(value: boolean) {
        this.constructAllowed = value;
    }

    getTop(): number {
        return this.button.y;
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
        this.scale.setTo(2);
        this.myCropRect = new Phaser.Rectangle(0, 0, 0, 8);
        this.crop(this.myCropRect, false);
    }

    update() {
        this.crop(this.myCropRect, false);
    }

    setProgress(percentage: number) {
        this.cropRect.width = WIDTH * percentage;
    }
}
