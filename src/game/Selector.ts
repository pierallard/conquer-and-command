import {UnitRepository} from "./repository/UnitRepository";
import {Player} from "./player/Player";
import {Cell} from "./Cell";

export class Selector extends Phaser.Graphics
{
    private isDoubleClick: boolean;
    private corner: PIXI.Point = null;
    private unitRepository: UnitRepository;
    private player: Player;
    private timerDoubleClick: Phaser.TimerEvent;

    constructor(game: Phaser.Game, unitRepository: UnitRepository, player: Player) {
        super(game, 0, 0);

        this.unitRepository = unitRepository;
        this.game.input.mouse.capture = true;
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        this.player = player;
    }

    update()
    {
        if (null === this.corner && this.game.input.activePointer.leftButton.isDown) {
            this.corner = new PIXI.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
        }

        if (this.corner !== null && this.game.input.activePointer.leftButton.isUp) {
            if (this.corner.x === this.game.input.mousePointer.x && this.corner.y === this.game.input.mousePointer.y) {
                let unitUnderPointer = this.unitRepository.unitAt(new PIXI.Point(
                    Cell.realToCell(this.corner.x),
                    Cell.realToCell(this.corner.y)
                ));
                if (unitUnderPointer && unitUnderPointer.getPlayer() !== this.player) {
                    unitUnderPointer = null;
                }
                if (this.isDoubleClick) {
                    this.unitRepository.getUnits().forEach((unit) => {
                        unit.setSelected(
                            unitUnderPointer !== null &&
                            unit.getPlayer() === this.player &&
                            unit.constructor === unitUnderPointer.constructor
                        );
                    });
                } else {
                    this.unitRepository.getUnits().forEach((unit) => {
                        unit.setSelected(unit === unitUnderPointer);
                    });
                }

            } else {
                const left = Math.min(this.corner.x, this.game.input.mousePointer.x);
                const right = Math.max(this.corner.x, this.game.input.mousePointer.x);
                const top = Math.min(this.corner.y, this.game.input.mousePointer.y);
                const bottom = Math.max(this.corner.y, this.game.input.mousePointer.y);

                this.unitRepository.getUnits().forEach((unit) => {
                    let isInside = false;
                    if (unit.getPlayer() === this.player) {
                        isInside = unit.isInside(left, right, top, bottom);
                    }
                    unit.setSelected(isInside);
                });
            }
            this.corner = null;
            this.clear();

            this.isDoubleClick = true;
            if (this.timerDoubleClick) {
                this.game.time.events.remove(this.timerDoubleClick);
            }
            this.timerDoubleClick = this.game.time.events.add(0.3 * Phaser.Timer.SECOND, () => {
                this.isDoubleClick = false;
            }, this);
        }

        if (this.game.input.activePointer.rightButton.isDown) {
            this.unitRepository.getSelectedUnits().forEach((source) => {
                source.updateStateAfterclick(new PIXI.Point(
                    Cell.realToCell(this.game.input.mousePointer.x),
                    Cell.realToCell(this.game.input.mousePointer.y)
                ));
            });
        }

        if (null !== this.corner) {
            this.clear();
            this.beginFill(0x00ff00);
            this.alpha = 0.5;
            this.drawRect(
                this.corner.x,
                this.corner.y,
                this.game.input.mousePointer.x - this.corner.x,
                this.game.input.mousePointer.y - this.corner.y
            );
        }
    }
}
