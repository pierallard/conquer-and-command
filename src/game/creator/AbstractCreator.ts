import {AbstractUICreator} from "./AbstractUICreator";
import {WorldKnowledge} from "../WorldKnowledge";
import {Player} from "../player/Player";

export abstract class AbstractCreator {
    protected timerEvent: Phaser.Timer;
    protected uiCreator: AbstractUICreator = null;
    protected worldKnowledge: WorldKnowledge;
    protected player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    abstract getProductables(): string[];

    abstract getRequiredBuildings(itemName: string): string[];

    create(game: Phaser.Game, uiCreator: AbstractUICreator) {
        this.timerEvent = game.time.events;
        this.uiCreator = uiCreator;
    }

    updateAlloweds() {
        if (this.uiCreator) {
            this.uiCreator.updateAlloweds(this.getAlloweds());
        }
    }

    isAllowed(itemName: string) {
        let found = true;
        this.getRequiredBuildings(itemName).forEach((requiredBuildingName) => {
            if (this.worldKnowledge.getPlayerBuildings(this.player, requiredBuildingName).length === 0) {
                found = false;
            }
        });

        return found;
    }

    private getAlloweds() {
        return this.getProductables().filter((itemName) => {
            return this.isAllowed(itemName);
        });
    }
}
