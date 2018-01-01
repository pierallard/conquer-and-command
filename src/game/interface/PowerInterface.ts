import {SCALE} from "../game_state/Play";
import {GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "./UserInterface";
import {BuildingProperties} from "../building/BuildingProperties";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";

const HEIGHT = 349 * 2;
const TOP = 5 * 2;

export class PowerInterface {
    private powerProgress: Phaser.Sprite;
    private powerArrow: Phaser.Sprite;
    private worldKnowledge: WorldKnowledge;
    private cropPowerProgress: Phaser.Rectangle;
    private player: Player;
    private maxPower: number;
    private game: Phaser.Game;
    private neededPower: number;
    private providedPower: number;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
        this.maxPower = BuildingProperties.getPower('AdvancedPowerPlant') * 10;
        this.neededPower = this.worldKnowledge.getPlayerNeededPower(this.player);
        this.providedPower = this.worldKnowledge.getPlayerProvidedPower(this.player);
    }

    create(game: Phaser.Game, group: Phaser.Group) {
        this.game = game;
        this.powerProgress = new Phaser.Sprite(
            game,
            GAME_WIDTH - INTERFACE_WIDTH + 4,
            TOP + HEIGHT,
            'interfaceprogress'
        );
        this.powerProgress.scale.setTo(SCALE);
        this.powerProgress.anchor.setTo(0, 1);

        this.cropPowerProgress = new Phaser.Rectangle(0, 0, 20, this.getHeight(this.providedPower));
        this.cropPowerProgress.scale(SCALE);

        this.powerArrow = new Phaser.Sprite(
            game,
            GAME_WIDTH - INTERFACE_WIDTH + 4,
            this.getTop(this.neededPower),
            'interfacelimit',
            1
        );
        this.powerArrow.scale.setTo(SCALE);

        this.powerArrow.anchor.setTo(0, 0.5);

        group.add(this.powerProgress);
        group.add(this.powerArrow);
    }

    update() {
        const neededPower = this.worldKnowledge.getPlayerNeededPower(this.player);
        const providedPower = this.worldKnowledge.getPlayerProvidedPower(this.player);

        if (this.neededPower !== neededPower) {
            this.game.add.tween(this.powerArrow).to({
                y: this.getTop(neededPower),
            }, 500, Phaser.Easing.Power0, true);
            this.neededPower = neededPower;
        }

        if (this.providedPower !== providedPower) {
            this.game.add.tween(this.cropPowerProgress).to({
                height: this.getHeight(providedPower),
            }, 500, Phaser.Easing.Power0, true);
            this.providedPower = providedPower;
        }

        this.powerArrow.loadTexture(this.powerArrow.key, neededPower > providedPower ? 0 : 1);
        this.powerProgress.crop(this.cropPowerProgress, false);
    }

    private getTop(value): number {
        return Math.round(TOP + HEIGHT - value * HEIGHT / this.maxPower);
    }

    private getHeight(value): number {
        // I have no idea why I have to divide by SCALE...
        return value * HEIGHT / this.maxPower / SCALE;
    }
}
