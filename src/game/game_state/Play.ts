import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../map/Ground";
import {Player} from "../player/Player";
import {BuildingRepository} from "../repository/BuildingRepository";
import {Minimap} from "../map/Minimap";

export const SCALE = 4;
export const CIRCLE_RADIUS: number = 19 * SCALE;
export const MOVE = 4;

export default class Play extends Phaser.State {
    private rightPanel: Phaser.Group;
    private minimap: Minimap;
    private unitRepository: UnitRepository;
    private buildingsRepository: BuildingRepository;
    private selector: Selector;
    private players: Player[];
    private ground: Ground;
    private upKey: Phaser.Key;
    private downKey: Phaser.Key;
    private leftKey: Phaser.Key;
    private rightKey: Phaser.Key;

    public create() {
        this.ground = new Ground(this);
        this.world.setBounds(0, 0, this.ground.getGroundWidth(), this.ground.getGroundHeight());
        this.unitRepository = new UnitRepository(this);
        this.buildingsRepository = new BuildingRepository(this);
        this.players = [
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank11', 0x00ff00),
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank12', 0xff00ff),
        ];

        this.unitRepository.generateRandomUnits(this.players);
        this.buildingsRepository.generateRandomBuildings(this.players);

        this.rightPanel = this.game.add.group();
        this.minimap = new Minimap(this, this.unitRepository, this.rightPanel);

        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    update()
    {
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
        this.minimap.update();

        if (this.upKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - MOVE);
            this.rightPanel.position.y = this.game.camera.position.y;
        }
        else if (this.downKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + MOVE);
            this.rightPanel.position.y = this.game.camera.position.y;
        }

        if (this.leftKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - MOVE, this.game.camera.position.y);
            this.rightPanel.position.x = this.game.camera.position.x;
        }
        else if (this.rightKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x + MOVE, this.game.camera.position.y);
            this.rightPanel.position.x = this.game.camera.position.x;
        }
    }

    render() {
        // this.game.debug.cameraInfo(this.game.camera, 500, 32);
    }
}
