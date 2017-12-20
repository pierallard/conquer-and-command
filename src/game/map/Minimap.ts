import Play, {SCALE} from "../game_state/Play";
import {UnitRepository} from "../repository/UnitRepository";
import TilemapLayer = Phaser.TilemapLayer;

const SIZE = 60;
const X = 571;
const Y = 9;
const REFRESH_TIME = 0.5 * Phaser.Timer.SECOND;

export class Minimap {
    private graphics: Phaser.Graphics;
    private unitRepository: UnitRepository;
    private game: Phaser.Game;
    private hasRenderedRecently: boolean = false;
    private layer: Phaser.TilemapLayer;

    constructor(play: Play, unitRepository: UnitRepository) {
        this.unitRepository = unitRepository;
        this.game = play.game;

        let map = new Phaser.Tilemap(play.game, 'basicmap');
        map.addTilesetImage('GrasClif', 'GrasClif');
        map.addTilesetImage('GrssMisc', 'GrssMisc');
        this.layer = map.createLayer('layer');
        let scale = SIZE / Math.max(map.widthInPixels, map.heightInPixels) * SCALE;
        this.layer.scale.setTo(scale, scale);
        this.layer.fixedToCamera = true;
        this.layer.cameraOffset.setTo(X * SCALE, Y * SCALE);
        this.layer.scrollFactorX = 0;
        this.layer.scrollFactorY = 0;
        this.game.add.existing(this.layer);

        let scale2 = SIZE / Math.max(map.width, map.height) * SCALE;
        this.graphics = new Phaser.Graphics(play.game);
        this.graphics.scale.set(scale2, scale2);
        this.graphics.position.setTo(X * SCALE, Y * SCALE);
        this.graphics.fixedToCamera = true;

        this.game.add.existing(this.graphics);
    }

    update() {
        if (this.hasRenderedRecently) {
            return;
        }

        this.graphics.clear();
        this.unitRepository.getUnits().forEach((unit) => {
            this.graphics.beginFill(unit.getPlayer().getColor());
            unit.getCellPositions().forEach((cellPosition) => {
                this.graphics.drawRect(cellPosition.x, cellPosition.y, 1, 1);
            });
        });

        this.hasRenderedRecently = true;
        this.game.time.events.add(REFRESH_TIME, () => {
            this.hasRenderedRecently = false;
        }, this);
    }
}
