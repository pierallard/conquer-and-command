import {Positionnable} from "./Positionnable";
import {Player} from "./player/Player";
import {Shootable} from "./Shootable";

export interface Army extends Positionnable, Shootable {
    isSelected(): boolean;
    destroy(): void;
    update(): void;
    create(game: Phaser.Game, unitBuildingGroup: Phaser.Group, effectsGroup: Phaser.Group): void;
    setVisible(b: boolean): void;
    getPlayer(): Player;
    setSelected(b: boolean): void;
    updateStateAfterClick(point: PIXI.Point): void;
    isInside(left: number, right: number, top: number, bottom: number): boolean;
}
