import {MovedSprite} from "../sprite/MovedSprite";
import Play from "../game_state/Play";
import {AStarSprite} from "../sprite/AStarSprite";
import {Player} from "../player/Player";

export class UnitRepository
{
    private units: MovedSprite[];
    public play_: Play;

    constructor(play_: Play)
    {
        this.play_ = play_;
        this.units = [];
    }

    public generateRandomUnits(players: Player[]): void
    {
        for (let i = 0; i < 80; i++) {
            let playerId = Math.floor(Math.random() * players.length);
            this.units.push(new AStarSprite(
                this,
                Math.random() * this.play_.game.width / 2 + (playerId === 1 ? this.play_.game.width / 2 : 0),
                Math.random() * this.play_.game.height,
                players[playerId]
            ));
        }
    }

    getUnits(): MovedSprite[] {
        return this.units;
    }

    removeSprite(movedSprite: MovedSprite) {
        const index = this.units.indexOf(movedSprite);
        if (index > -1) {
            this.units.splice(index, 1);
        }
    }

    isCellNotOccupied(position: PIXI.Point): boolean {
        return null === this.unitAt(position)
    }

    unitAt(position: PIXI.Point): AStarSprite {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i] instanceof AStarSprite) {
                if (
                    (<AStarSprite> this.units[i]).getCellPosition().x === position.x &&
                    (<AStarSprite> this.units[i]).getCellPosition().y === position.y
                ) {
                    return (<AStarSprite> this.units[i]);
                }
            }
        }

        return null;
    }

    getEnnemyUnits(player: Player): MovedSprite[] {
        return this.units.filter((unit) => {
            return (<AStarSprite> unit).getPlayer() !== player;
        });
    }
}
