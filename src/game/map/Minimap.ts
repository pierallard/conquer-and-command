import Play from "../game_state/Play";
import {UnitRepository} from "../repository/UnitRepository";

const SIZE = 200;

export class Minimap {
    private map: Phaser.Tilemap;
    private graphics: Phaser.Graphics;
    private unitRepository: UnitRepository;

    constructor(play: Play, unitRepository: UnitRepository) {
        this.unitRepository = unitRepository;
        
        this.map = play.game.add.tilemap('basicmap');
        this.map.addTilesetImage('GrasClif', 'GrasClif');
        this.map.addTilesetImage('GrssMisc', 'GrssMisc');
        let layer = this.map.createLayer('layer');
        let scale = SIZE / Math.max(this.map.widthInPixels, this.map.heightInPixels)

        layer.scale.setTo(scale, scale);

        this.graphics = play.game.add.graphics();
        this.graphics.scale.set(1 / scale, 1 / scale);
    }

    update() {
        this.graphics.clear();
        this.unitRepository.getUnits().forEach((unit) => {
            this.graphics.beginFill(unit.getPlayer().getColor());
            unit.getCellPositions().forEach((cellPosition) => {
                this.graphics.drawRect(cellPosition.x, cellPosition.y, 1, 1);
            });
        });
    }
}
