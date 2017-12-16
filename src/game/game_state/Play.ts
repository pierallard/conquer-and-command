import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../Ground";
import {Player} from "../player/Player";
import {BuildingRepository} from "../repository/BuildingRepository";

export const SCALE = 1.5;
export const CIRCLE_RADIUS: number = 19 * SCALE;
export const MOVE = 4;

export default class Play extends Phaser.State {
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
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank11'),
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank12'),
        ];

        this.unitRepository.generateRandomUnits(this.players);
        this.buildingsRepository.generateRandomBuildings(this.players);
        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    }

    public update()
    {
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });

        if (this.upKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - MOVE);
        }
        else if (this.downKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + MOVE);
        }

        if (this.leftKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - MOVE, this.game.camera.position.y);
        }
        else if (this.rightKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x + MOVE, this.game.camera.position.y);
        }
    }
}