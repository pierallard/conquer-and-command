import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../map/Ground";
import {Player} from "../player/Player";
import {BuildingRepository} from "../repository/BuildingRepository";
import {Minimap} from "../map/Minimap";
import {UnitCreator} from "../UnitCreator";

export const SCALE = 2;
export const CIRCLE_RADIUS: number = 19 * SCALE;
export const MOVE = 3 * SCALE;
export const PANEL_WIDTH = 80;

export default class Play extends Phaser.State {
    private interfaceGroup: Phaser.Group;
    private unitBuildingGroup: Phaser.Group;
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
    private zKey: Phaser.Key;
    private sKey: Phaser.Key;
    private qKey: Phaser.Key;
    private dKey: Phaser.Key;

    public create() {
        // Create world
        this.ground = new Ground(this.game);

        this.unitBuildingGroup = this.game.add.group();
        this.unitBuildingGroup.fixedToCamera = false;
        this.unitRepository = new UnitRepository(this, this.unitBuildingGroup);
        this.buildingsRepository = new BuildingRepository(this, this.unitBuildingGroup);

        this.players = [
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank11', 0x00ff00),
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank12', 0xff00ff),
        ];

        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);

        this.interfaceGroup = this.game.add.group();
        this.interfaceGroup.fixedToCamera = true;

        let interface_ = new Phaser.Sprite(this.game, 0, 0, 'interface');
        interface_.scale.setTo(SCALE);
        this.interfaceGroup.add(interface_);

        let zelifnsleiffn = new UnitCreator(this.game, this.interfaceGroup, this.buildingsRepository);

        this.minimap = new Minimap(this, this.unitRepository);

        this.world.setBounds(0, 0, this.ground.getGroundWidth(), this.ground.getGroundHeight());

        this.game.camera.bounds.setTo(
            0,
            0,
            this.ground.getGroundWidth() + PANEL_WIDTH * SCALE,
            this.ground.getGroundHeight()
        );

        // Generate units
        this.unitRepository.generateRandomUnits(this.players);
        this.buildingsRepository.generateRandomBuildings(this.players);

        // Register inputs
        this.registerInputs();
    }

    update()
    {
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
        this.minimap.update();

        if (this.upKey.isDown || this.zKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - MOVE);
        }
        else if (this.downKey.isDown || this.sKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + MOVE);
        }

        if (this.leftKey.isDown || this.qKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - MOVE, this.game.camera.position.y);
        }
        else if (this.rightKey.isDown || this.dKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x + MOVE, this.game.camera.position.y);
        }
    }

    private registerInputs() {
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.qKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }
}
