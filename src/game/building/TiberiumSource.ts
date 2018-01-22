import {Building} from "./Building";
import {Player} from "../player/Player";
import {Cell} from "../computing/Cell";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {GROUP, SCALE} from "../game_state/Play";
import {TiberiumPlant} from "../sprite/TiberiumPlant";
import {Distance} from "../computing/Distance";
import {Harvester} from "../unit/Harvester";

const RADIUS = 6;

export class TiberiumSource implements Building {
    private worldKnowledge: WorldKnowledge;
    private cellPosition: PIXI.Point;
    private sprite: Phaser.Sprite;
    private game: Phaser.Game;
    private group: Phaser.Group;
    private plants: TiberiumPlant[];

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point) {
        this.worldKnowledge = worldKnowledge;
        this.cellPosition = cellPosition;
        this.plants = [];
    }

    create(game: Phaser.Game, groups: Phaser.Group[]): void {
        this.game = game;
        this.group = groups[GROUP.UNIT];
        this.sprite = game.add.sprite(
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'GrssMisc-2060',
            0
        );
        this.sprite.scale.setTo(SCALE, SCALE);
        this.sprite.anchor.setTo(0.5, 5 / 6);
        groups[GROUP.GROUND].add(this.sprite);
        for (let i = 0; i < 20; i++) {
            this.spread();
        }
    }

    spread() {
        let attempts = 100;
        let spreaded = false;

        while (!spreaded && attempts > 0) {
            const newTry = new PIXI.Point(
                Math.ceil(RADIUS * 2 * Math.random() + this.cellPosition.x - RADIUS),
                Math.ceil(RADIUS * 2 * Math.random() + this.cellPosition.y - RADIUS),
            );
            if (Distance.to(this.cellPosition, newTry) <= RADIUS && null === this.worldKnowledge.getGroundAt(newTry)) {
                const newPlant = new TiberiumPlant(this, this.game, newTry.x, newTry.y);
                this.worldKnowledge.addGroundElement(newPlant);
                this.plants.push(newPlant);
                spreaded = true;
            }
            attempts--;
        }
    }

    setVisible(value: boolean): void {
    }

    isVisible(): boolean {
        return true;
    }

    getPlayer(): Player {
        return null;
    }

    destroy(): void {
    }

    getCellPositions(): PIXI.Point[] {
        return [this.cellPosition];
    }

    isEmpty() {
        for (let i = 0; i < this.plants.length; i++) {
            if (!this.plants[i].isEmpty()) {
                return false;
            }
        }

        return true;
    }

    getFreePlants(harvester: Harvester): TiberiumPlant[] {
        return this.plants.filter((plant) => {
            const unit = this.worldKnowledge.getGroundArmyAt(plant.getCellPositions()[0]);

            return unit === null || unit === harvester;
        });
    }

    remove(tiberiumPlant: TiberiumPlant) {
        const index = this.plants.indexOf(tiberiumPlant);
        this.plants.splice(index, 1);
    }

    update(): void {
        // TODO Do Spread every x seconds
    }

    isSelected(): boolean {
        return false;
    }

    setSelected(b: boolean): void {
    }

    updateStateAfterClick(point: PIXI.Point): void {
    }

    isInside(left: number, right: number, top: number, bottom: number): boolean {
        return false;
    }

    lostLife(life: number): void {
    }

    isAlive(): boolean {
        return true;
    }

    isOnGround(): boolean {
        return true;
    }
}
