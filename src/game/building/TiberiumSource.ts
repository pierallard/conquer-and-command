import {Building} from "./Building";
import {Player} from "../player/Player";
import {Cell} from "../computing/Cell";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {SCALE} from "../game_state/Play";
import {TiberiumPlant} from "../sprite/TiberiumPlant";
import {Distance} from "../computing/Distance";

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

    create(game: Phaser.Game, group: Phaser.Group): void {
        this.game = game;
        this.group = group;
        this.sprite = game.add.sprite(
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            'GrssMisc-2060',
            0
        );
        this.sprite.scale.setTo(SCALE, SCALE);
        this.sprite.anchor.setTo(0.5, 5 / 6);
        group.add(this.sprite);
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

    getPlants(): TiberiumPlant[] {
        return this.plants;
    }
}
