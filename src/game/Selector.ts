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

        this.game.add.existing(this);
    }

    getMousePointer(): PIXI.Point {
        return new PIXI.Point(
            this.game.input.mousePointer.x + this.game.camera.position.x,
            this.game.input.mousePointer.y + this.game.camera.position.y
        );
    }

    update()
    {
        if (null === this.corner && this.game.input.activePointer.leftButton.isDown) {
            this.corner = this.getMousePointer();
        }

        if (this.corner !== null && this.game.input.activePointer.leftButton.isUp) {
            if (this.corner.x === this.getMousePointer().x && this.corner.y === this.getMousePointer().y) {
                let unitUnderPointer = this.unitRepository.unitAt(new PIXI.Point(
                    Cell.realToCell(this.corner.x),
                    Cell.realToCell(this.corner.y)
                ));
                if (unitUnderPointer && unitUnderPointer.getPlayer() !== this.player) {
                    unitUnderPointer = null;
                }
                if (unitUnderPointer && this.isDoubleClick) {
                    this.selectUnitsInside(
                        new PIXI.Point(
                            this.game.camera.position.x,
                            this.game.camera.position.y
                        ),
                        new PIXI.Point(
                            this.game.camera.position.x + this.game.width,
                            this.game.camera.position.y + this.game.height,
                        ),
                        unitUnderPointer.constructor
                    );
                } else {
                    this.unitRepository.getUnits().forEach((unit) => {
                        unit.setSelected(unit === unitUnderPointer);
                    });
                }

            } else {
                this.selectUnitsInside(this.corner, this.getMousePointer());
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
                    Cell.realToCell(this.getMousePointer().x),
                    Cell.realToCell(this.getMousePointer().y)
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
                this.getMousePointer().x - this.corner.x,
                this.getMousePointer().y - this.corner.y
            );
        }
    }

    private selectUnitsInside(corner: PIXI.Point, mousePointer: PIXI.Point, constructor: any = null) {
        const left = Math.min(corner.x, mousePointer.x);
        const right = Math.max(corner.x, mousePointer.x);
        const top = Math.min(corner.y, mousePointer.y);
        const bottom = Math.max(corner.y, mousePointer.y);

        this.unitRepository.getUnits().forEach((unit) => {
            let isInside = false;
            if (unit.getPlayer() === this.player && (null === constructor || unit.constructor == constructor)) {
                isInside = unit.isInside(left, right, top, bottom);
            }
            unit.setSelected(isInside);
        });
    }

}
