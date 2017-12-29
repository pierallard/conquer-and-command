import {Building} from "./Building";
import {Player} from "../player/Player";
import {BuildingProperties} from "./BuildingProperties";
import {BuildingSprite} from "../sprite/BuildingSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Shootable} from "../Shootable";
import {Positionnable} from "../Positionnable";

export abstract class ConstructableBuilding implements Building, Shootable {
    protected player: Player;
    protected cellPosition: PIXI.Point;
    protected sprite: BuildingSprite;
    protected life: number = 100;
    private worldKnowledge: WorldKnowledge;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.cellPosition = cellPosition;
        this.player = player;
    }

    abstract create(game: Phaser.Game, group: Phaser.Group): void;

    setVisible(value: boolean) {
        this.sprite.alpha = value ? 1 : 0;
    }

    getCellPositions(): PIXI.Point[] {
        return BuildingProperties.getCellPositions(this.constructor.name).map((position) => {
            return new PIXI.Point(position.x + this.cellPosition.x, position.y + this.cellPosition.y);
        });
    };

    getPlayer(): Player {
        return this.player;
    }

    destroy(): void {
        this.sprite.doDestroy();
    }

    lostLife(life: number) {
        this.life -= life;
        if (!this.isAlive()) {
            this.sprite.doDestroy();
            this.worldKnowledge.removeBuilding(this);
        }
    }

    private isAlive(): boolean {
        return this.life > 0;
    }
}
