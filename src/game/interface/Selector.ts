import {Player} from "../player/Player";
import {Cell} from "../computing/Cell";
import {WorldKnowledge} from "../map/WorldKnowledge";

export class Selector {
    private camera: Phaser.Camera;
    private isDoubleClick: boolean;
    private corner: PIXI.Point = null;
    private worldKnowledge: WorldKnowledge;
    private player: Player;
    private timerDoubleClick: Phaser.TimerEvent;
    private graphics: Phaser.Graphics;
    private mousePointer: Phaser.Pointer;
    private leftButton: Phaser.DeviceButton;
    private rightButton: Phaser.DeviceButton;
    private gameWidth: number;
    private gameHeight: number;
    private timeEvents: Phaser.Timer;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    create(game: Phaser.Game) {
        this.mousePointer = game.input.mousePointer;
        this.camera = game.camera;
        this.leftButton = game.input.activePointer.leftButton;
        this.rightButton = game.input.activePointer.rightButton;
        this.graphics = game.add.graphics(0, 0);
        this.timeEvents = game.time.events;

        // TODO Remove these values
        this.gameWidth = game.width;
        this.gameHeight = game.height;

        game.input.mouse.capture = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

        game.add.existing(this.graphics);
    }

    getMousePointer(): PIXI.Point {
        return new PIXI.Point(
            this.mousePointer.x + this.camera.position.x,
            this.mousePointer.y + this.camera.position.y
        );
    }

    update() {
        if (null === this.corner && this.leftButton.isDown) {
            this.corner = this.getMousePointer();
        }

        if (this.corner !== null && this.leftButton.isUp) {
            if (this.corner.x === this.getMousePointer().x && this.corner.y === this.getMousePointer().y) {
                let unitUnderPointer = this.worldKnowledge.getUnitAt(new PIXI.Point(
                    Cell.realToCell(this.corner.x),
                    Cell.realToCell(this.corner.y)
                ));
                if (unitUnderPointer && unitUnderPointer.getPlayer() !== this.player) {
                    unitUnderPointer = null;
                }
                if (unitUnderPointer && this.isDoubleClick) {
                    this.selectUnitsInside(
                        new PIXI.Point(this.camera.position.x, this.camera.position.y),
                        new PIXI.Point(
                            this.camera.position.x + this.gameWidth,
                            this.camera.position.y + this.gameHeight,
                        ),
                        unitUnderPointer.constructor
                    );
                } else {
                    this.worldKnowledge.getUnits().forEach((unit) => {
                        unit.setSelected(unit === unitUnderPointer);
                    });
                }

            } else {
                this.selectUnitsInside(this.corner, this.getMousePointer());
            }
            this.corner = null;
            this.graphics.clear();

            this.isDoubleClick = true;
            if (this.timerDoubleClick) {
                this.timeEvents.remove(this.timerDoubleClick);
            }
            this.timerDoubleClick = this.timeEvents.add(0.3 * Phaser.Timer.SECOND, () => {
                this.isDoubleClick = false;
            }, this);
        }

        if (this.rightButton.isDown) {
            this.worldKnowledge.getSelectedUnits().forEach((source) => {
                source.updateStateAfterClick(new PIXI.Point(
                    Cell.realToCell(this.getMousePointer().x),
                    Cell.realToCell(this.getMousePointer().y)
                ));
            });
        }

        if (null !== this.corner) {
            this.graphics.clear();
            this.graphics.beginFill(0x00ff00);
            this.graphics.alpha = 0.5;
            this.graphics.drawRect(
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

        this.worldKnowledge.getUnits().forEach((unit) => {
            let isInside = false;
            if (unit.getPlayer() === this.player && (null === constructor || unit.constructor === constructor)) {
                isInside = unit.isInside(left, right, top, bottom);
            }
            unit.setSelected(isInside);
        });
    }

}
