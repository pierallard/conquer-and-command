import {Player} from "../player/Player";

export interface Building {
    getCellPositions(): PIXI.Point[];
    create(game: Phaser.Game, group: Phaser.Group): void;
    setVisible(value: boolean): void;
    getPlayer(): Player;
    lostLife(life: number): void;
    destroy(): void;
}
