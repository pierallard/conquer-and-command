import Play from "../game_state/Play";
import {Unit} from "../unit/Unit";
import {Player} from "../player/Player";
import {Tank} from "../unit/Tank";
import {Harvester} from "../unit/Harvester";

export class UnitRepository
{
    private units: Unit[];
    public play_: Play;

    constructor(play_: Play)
    {
        this.play_ = play_;
        this.units = [];
    }

    public generateRandomUnits(players: Player[]): void
    {
        for (let i = 0; i < 30; i++) {
            let playerId = Math.floor(Math.random() * players.length);
            this.units.push(new Tank(
                players[playerId],
                Math.random() * this.play_.game.width / 2 + (playerId === 1 ? this.play_.game.width / 2 : 0),
                Math.random() * this.play_.game.height
            ));
        }
        for (let i = 0; i < 10; i++) {
            this.units.push(new Harvester(
                players[0],
                Math.random() * this.play_.game.width / 2,
                Math.random() * this.play_.game.height
            ));
        }
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
        return null === this.unitAt(position)
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
