import {Selector} from "../Selector";
import {UnitRepository} from "../repository/UnitRepository";
import {Ground} from "../map/Ground";
import {Player} from "../player/Player";
import {BuildingRepository} from "../repository/BuildingRepository";
import {Minimap} from "../map/Minimap";

export const SCALE = 2;
export const CIRCLE_RADIUS: number = 19 * SCALE;
export const MOVE = 4;
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

    public create() {
        this.interfaceGroup = this.game.add.group(null, 'interface', true);
        this.unitBuildingGroup = this.game.add.group(null, 'unit_buildings', true);
        this.unitBuildingGroup.fixedToCamera = false;
        this.unitBuildingGroup.create(0, 0, 'IntButtn');
        this.unitBuildingGroup.cameraOffset.set(10, 10);

        this.ground = new Ground(this.game);
        this.unitRepository = new UnitRepository(this, this.unitBuildingGroup);

        this.world.setBounds(0, 0, this.ground.getGroundWidth(), this.ground.getGroundHeight());
        this.buildingsRepository = new BuildingRepository(this);
        this.players = [
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank11', 0x00ff00),
            new Player(this.ground, this.unitRepository, this.buildingsRepository, 'Tank12', 0xff00ff),
        ];

        this.unitRepository.generateRandomUnits(this.players);
        this.buildingsRepository.generateRandomBuildings(this.players);

        this.minimap = new Minimap(this, this.unitRepository);

        this.selector = new Selector(this.game, this.unitRepository, this.players[0]);

        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        let interface_ = new Phaser.Sprite(this.game, 0, 0, 'interface');
        this.interfaceGroup.add(interface_);

        interface_.scale.setTo(SCALE);
        this.game.camera.bounds.setTo(
            0,
            0,
            this.ground.getGroundWidth() + PANEL_WIDTH * SCALE,
            this.ground.getGroundHeight()
        );
    }

    update()
    {
        console.log(this.unitBuildingGroup.position);
        this.unitRepository.getUnits().forEach((unit) => {
            unit.update();
        });
        this.minimap.update();

        if (this.upKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - MOVE);
            // this.interfaceGroup.position.y = this.game.camera.position.y;
        }
        else if (this.downKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + MOVE);
            // this.interfaceGroup.position.y = this.game.camera.position.y;
        }

        if (this.leftKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - MOVE, this.game.camera.position.y);
            // this.interfaceGroup.position.x = this.game.camera.position.x;
        }
        else if (this.rightKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x + MOVE, this.game.camera.position.y);
            // this.interfaceGroup.position.x = this.game.camera.position.x;
        }
    }
}
