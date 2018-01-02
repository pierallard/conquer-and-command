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

    abstract hasMineralsToProduct(itemName: string): boolean;

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
        if (this.canProduct(itemName)) {
            return this.runProduction(itemName);
        }
    }

    isAllowed(itemName: string): boolean {
        let found = true;
        this.getRequiredBuildings(itemName).forEach((requiredBuildingName) => {
            if (this.worldKnowledge.getPlayerBuildings(this.player, requiredBuildingName).length === 0) {
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

    isProducing(itemName: string) {
        return this.productionStatus &&
            this.productionStatus.getItemName() === itemName;
    }

    isProducingAny() {
        return null !== this.productionStatus;
    }
}

export class ProductionStatus {
    public percentage: number;
    private itemName: string;

    constructor(itemName: string, duration: number, game: Phaser.Game) {
        this.itemName = itemName;
        this.percentage = 0;
        game.add.tween(this).to({
            percentage: 1,
        }, duration, Phaser.Easing.Default, true);
    }

    getItemName(): string {
        return this.itemName;
    }
}
