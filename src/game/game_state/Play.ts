import {WorldKnowledge} from "../map/WorldKnowledge";
import {UserInterface} from "../interface/UserInterface";
import {MCV} from "../unit/MCV";
import {HumanPlayer} from "../player/HumanPlayer";
import {ComputerPlayer} from "../player/ComputerPlayer";
import {GROUND_HEIGHT, GROUND_WIDTH} from "../map/GeneratedGround";
import {TiberiumSource} from "../building/TiberiumSource";
import {AdvancedGuardTower} from "../building/AdvancedGuardTower";
import {AlternativePosition} from "../computing/AlternativePosition";

export const _DEBUG_FAST_CONSTRUCT = true;
export const SCALE = 2;
export const MOVE = 3 * SCALE;
export const PANEL_WIDTH = 80;

export default class Play extends Phaser.State {
    private upKey: Phaser.Key;
    private downKey: Phaser.Key;
    private leftKey: Phaser.Key;
    private rightKey: Phaser.Key;
    private zKey: Phaser.Key;
    private sKey: Phaser.Key;
    private qKey: Phaser.Key;
    private dKey: Phaser.Key;
    private worldKnowledge: WorldKnowledge;
    private userInterface: UserInterface;
    private startPositions: PIXI.Point[];
    private startTiberiums: PIXI.Point[];

    constructor() {
        super();

        this.startPositions = [
            new PIXI.Point(Math.round(GROUND_WIDTH / 5), Math.round(GROUND_HEIGHT / 5)),
            new PIXI.Point(Math.round(GROUND_WIDTH * 4 / 5), Math.round(GROUND_HEIGHT * 4 / 5)),
        ];
        this.startTiberiums = [
            new PIXI.Point(Math.round(GROUND_WIDTH * 2 / 5), Math.round(GROUND_HEIGHT / 5)),
            new PIXI.Point(Math.round(GROUND_WIDTH * 3 / 5), Math.round(GROUND_HEIGHT * 4 / 5)),
        ];

        this.worldKnowledge = new WorldKnowledge();
        this.worldKnowledge.addPlayer(new HumanPlayer(this.worldKnowledge, 0, 0x00ff00));
        this.worldKnowledge.addPlayer(new ComputerPlayer(this.worldKnowledge, 1, 0xff00ff));
        this.userInterface = new UserInterface(this.worldKnowledge, this.worldKnowledge.getPlayers()[0]);
    }

    public create() {
        this.worldKnowledge.create(this.game, this.startPositions.concat(this.startTiberiums));
        this.userInterface.create(this.game);

        this.world.setBounds(0, 0, this.worldKnowledge.getGroundWidth(), this.worldKnowledge.getGroundHeight());
        this.game.camera.bounds.setTo(
            0,
            0,
            this.worldKnowledge.getGroundWidth() + PANEL_WIDTH * SCALE,
            this.worldKnowledge.getGroundHeight()
        );

        this.registerInputs();

        this.start();
    }

    public start() {
        this.worldKnowledge.addUnit(new MCV(
            this.worldKnowledge,
            this.startPositions[0],
            this.worldKnowledge.getPlayers()[0]
        ));
        this.worldKnowledge.addUnit(new MCV(
            this.worldKnowledge,
            this.startPositions[1],
            this.worldKnowledge.getPlayers()[1]
        ));
        this.startTiberiums.forEach((tiberiumPosition) => {
            this.worldKnowledge.addBuilding(new TiberiumSource(
                this.worldKnowledge,
                tiberiumPosition
            ));
        });

        this.game.time.events.loop(5000, () => {
            this.worldKnowledge.getPlayers().filter((player) => {
                if (player.constructor.name === 'ComputerPlayer') {
                    (<ComputerPlayer> player).update();
                }
            });
        });

        AlternativePosition.getZones(this.worldKnowledge.isCellAccessible.bind(this.worldKnowledge));
    }

    update() {
        this.worldKnowledge.update();
        this.userInterface.update();

        if (this.upKey.isDown || this.zKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y - MOVE);
        } else if (this.downKey.isDown || this.sKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x, this.game.camera.position.y + MOVE);
        }

        if (this.leftKey.isDown || this.qKey.isDown) {
            this.game.camera.setPosition(this.game.camera.position.x - MOVE, this.game.camera.position.y);
        } else if (this.rightKey.isDown || this.dKey.isDown) {
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
