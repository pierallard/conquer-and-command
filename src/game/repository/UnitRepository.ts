import Play from "../game_state/Play";
import {Unit} from "../unit/Unit";
import {Player} from "../player/Player";
import {Tank} from "../unit/Tank";
import {Harvester} from "../unit/Harvester";

export class UnitRepository {
    // TODO Remove this
    public play: Play;
    private units: Unit[];
    private group: Phaser.Group;

    constructor(play: Play, group: Phaser.Group) {
        this.play = play;
        this.units = [];
        this.group = group;
    }

    public generateRandomUnits(players: Player[]): void {
        for (let i = 0; i < 30; i++) {
            let playerId = Math.floor(Math.random() * players.length);
            this.add(new Tank(
                players[playerId],
                Math.random() * this.play.game.world.width / 2 + (playerId === 1 ? this.play.game.world.width / 2 : 0),
                Math.random() * this.play.game.world.height,
                this.group
            ));
        }
        for (let i = 0; i < 10; i++) {
            this.add(new Harvester(
                players[0],
                Math.random() * this.play.game.world.width / 2,
                Math.random() * this.play.game.world.height,
                this.group
            ));
        }
    }

    add(unit: Unit): void {
        this.units.push(unit);
    }

    getUnits(): Unit[] {
        return this.units;
    }

    removeSprite(movedSprite: Unit) {
        const index = this.units.indexOf(movedSprite);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return null === this.unitAt(position);
    }

    unitAt(position: PIXI.Point): Unit {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i] instanceof Unit) {
                const cellPositions = this.units[i].getCellPositions();
                for (let j = 0; j < cellPositions.length; j++) {
                    if (
                        cellPositions[j].x === position.x &&
                        cellPositions[j].y === position.y
                    ) {
                        return (<Unit> this.units[i]);
                    }
                }
            }
        }

        return null;
    }

    getEnnemyUnits(player: Player): Unit[] {
        return this.units.filter((unit) => {
            return unit.getPlayer() !== player;
        });
    }

    getSelectedUnits() {
        return this.units.filter((unit) => {
            return unit.isSelected();
        });
    }
}
