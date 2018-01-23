import {Building} from "./Building";
import {Player} from "../player/Player";
import {BuildingProperties} from "./BuildingProperties";
import {BuildingSprite} from "../sprite/BuildingSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Engineer} from "../unit/Engineer";

export abstract class ConstructableBuilding implements Building {
    protected player: Player;
    protected cellPosition: PIXI.Point;
    protected sprite: BuildingSprite;
    protected life: number = 100;
    protected maxLife: number = 100;
    protected worldKnowledge: WorldKnowledge;
    protected selected: boolean = false;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.cellPosition = cellPosition;
        this.player = player;
        this.life = this.maxLife = BuildingProperties.getLife(this.constructor.name);
    }

    abstract create(game: Phaser.Game, groups: Phaser.Group[]): void;

    setVisible(value: boolean) {
        this.sprite.alpha = value ? 1 : 0;
    }

    isVisible(): boolean {
        return this.sprite.alpha > 0;
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
            this.worldKnowledge.removeArmy(this);
            this.destroy();
        }

        this.sprite.updateLife(this.life, this.maxLife);
    }

    update(): void {
    }

    isSelected(): boolean {
        return this.selected;
    }

    setSelected(value: boolean): void {
        this.selected = value;
        this.sprite.setSelected(value);
    }

    updateStateAfterClick(point: PIXI.Point): void {
    }

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return this.sprite.isInside(left, right, top, bottom);
    }

    isAlive(): boolean {
        return this.life > 0;
    }

    isOnGround(): boolean {
        return true;
    }

    capture(engineer: Engineer) {
        this.player = engineer.getPlayer();
        this.worldKnowledge.removeArmy(engineer);
    }
}
