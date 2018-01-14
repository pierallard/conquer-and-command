import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";

export abstract class AbstractCreator {
    protected timerEvent: Phaser.Timer;
    protected worldKnowledge: WorldKnowledge;
    protected player: Player;
    protected productionStatus: ProductionStatus = null;
    protected game: Phaser.Game;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    abstract getRequiredBuildings(itemName: string): string[];

    abstract canProduct(itemName: string): boolean;

    abstract runProduction(itemName: string): void;

    create(game: Phaser.Game) {
        this.timerEvent = game.time.events;
        this.game = game;
    }

    getPlayer(): Player {
        return this.player;
    }

    orderProduction(itemName) {
        if (this.productionStatus && this.productionStatus.getItemName() === itemName) {
            this.productionStatus.playerUnHold();
        } else {
            if (this.canProduct(itemName)) {
                return this.runProduction(itemName);
            }
        }
    }

    isAllowed(itemName: string): boolean {
        let found = true;
        this.getRequiredBuildings(itemName).forEach((requiredBuildingName) => {
            if (this.worldKnowledge.getPlayerArmies(this.player, requiredBuildingName).length === 0) {
                found = false;
            }
        });

        return found;
    }

    getProductionStatus(): ProductionStatus {
        return this.productionStatus;
    }

    isProduced(itemName: string) {
        return this.productionStatus &&
            this.productionStatus.getItemName() === itemName &&
            this.productionStatus.percentage >= 1;
    }

    isProducingAny() {
        return null !== this.productionStatus;
    }

    isProducing(itemName: string) {
        return this.productionStatus && this.productionStatus.getItemName() === itemName;
    }

    hold(itemName: string) {
        if (this.productionStatus && this.productionStatus.getItemName() === itemName) {
            this.productionStatus.playerHold();
        }
    }

    isHold(itemName: string) {
        return this.productionStatus &&
            this.productionStatus.getItemName() === itemName &&
            this.productionStatus.isHold();
    }

    cancel(itemName: string) {
        if (this.isHold(itemName)) {
            this.productionStatus.cancel();
            this.productionStatus = null;
        }
    }

    unHoldProductionStatus() {
        if (this.productionStatus) {
            this.productionStatus.unHold();
        }
    }
}

export class ProductionStatus {
    public percentage: number;
    private itemName: string;
    private tween: Phaser.Tween;
    private previousPercentage: number;
    private price: number;
    private player: Player;
    private isHoldPlayer: boolean;

    constructor(itemName: string, duration: number, price: number, player: Player, callBack: any, game: Phaser.Game) {
        this.itemName = itemName;
        this.percentage = 0;
        this.previousPercentage = 0;
        this.price = price;
        this.player = player;
        this.isHoldPlayer = false;
        this.tween = game.add.tween(this).to({
            percentage: 1,
        }, duration, Phaser.Easing.Default, true);
        this.tween.onComplete.add(() => {
            player.removeMinerals(this.diffMinerals());
            player.removeMinerals(this.diffMinerals());
            callBack(this.itemName);
        });
        this.tween.onUpdateCallback(() => {
            if (this.player.getMinerals() - this.diffMinerals() > 0) {
                player.removeMinerals(this.diffMinerals());
            } else {
                this.hold();
            }
            this.previousPercentage = this.percentage;
        });
    }

    getItemName(): string {
        return this.itemName;
    }

    playerHold() {
        this.isHoldPlayer = true;
        this.hold();
    }

    playerUnHold() {
        this.isHoldPlayer = false;
        this.unHold();
    }

    unHold() {
        this.tween.resume();
    }

    isHold() {
        return this.isHoldPlayer && this.tween.isPaused;
    }

    cancel() {
        this.tween.stop(false);
        this.player.addMinerals(this.percentage * this.price);
    }

    private diffMinerals() {
        return (this.percentage - this.previousPercentage) * this.price;
    }

    private hold() {
        this.tween.pause();
    }
}
