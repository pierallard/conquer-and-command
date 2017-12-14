import Play from "../game_state/Play";
import {AStarSprite} from "../sprite/AStarSprite";
import {Player} from "../player/Player";

export class UnitRepository
{
    private units: AStarSprite[];
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
                players[playerId],
                Math.random() * this.play_.game.width / 2 + (playerId === 1 ? this.play_.game.width / 2 : 0),
                Math.random() * this.play_.game.height
            ));
        }
    }

    getUnits(): AStarSprite[] {
        return this.units;
    }

    removeSprite(movedSprite: AStarSprite) {
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
                    this.units[i].getCellPosition().x === position.x &&
                    this.units[i].getCellPosition().y === position.y
                ) {
                    return (<AStarSprite> this.units[i]);
                }
            }
        }

        return null;
    }

    getEnnemyUnits(player: Player): AStarSprite[] {
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
