import {WorldKnowledge} from "../map/WorldKnowledge";
import {UIBuildingCreator} from "../creator/UIBuildingCreator";
import {MiniMap} from "../map/Minimap";
import {Player} from "../player/Player";
import {BuildingPositioner} from "./BuildingPositionner";
import {Selector} from "./Selector";
import {UIUnitCreator} from "../creator/UIUnitCreator";
import {GAME_WIDTH} from "../../app";
import {PowerInterface} from "./PowerInterface";

export const INTERFACE_WIDTH = 94 * 2;

export class UserInterface {
    private UIBuildingCreator: UIBuildingCreator;
    private UIUnitCreator: UIUnitCreator;
    private interfaceGroup: Phaser.Group;
    private miniMap: MiniMap;
    private player: Player;
    private selector: Selector;
    private buildingPositionner: BuildingPositioner;
    private mineralText: Phaser.Text;
    private powerInterface: PowerInterface;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.player = player;
        this.selector = new Selector(worldKnowledge, player);
        this.buildingPositionner = new BuildingPositioner(worldKnowledge, this.player);
        this.UIBuildingCreator = new UIBuildingCreator(worldKnowledge, this.player, this.buildingPositionner);
        this.UIUnitCreator = new UIUnitCreator(worldKnowledge, this.player);
        this.miniMap = new MiniMap(worldKnowledge);
        this.powerInterface = new PowerInterface(worldKnowledge, this.player);
    }

    create(game: Phaser.Game) {
        this.buildingPositionner.create(game);
        this.selector.create(game);

        this.interfaceGroup = game.add.group();
        this.interfaceGroup.fixedToCamera = true;

        let interfaceSprite = new Phaser.Sprite(game, 0, 0, 'interface');
        interfaceSprite.scale.setTo(2);
        this.interfaceGroup.add(interfaceSprite);

        this.UIUnitCreator.create(game, this.interfaceGroup);
        this.UIBuildingCreator.create(game, this.interfaceGroup);
        this.miniMap.create(game, this.interfaceGroup);

        this.mineralText = new Phaser.Text(
            game,
            GAME_WIDTH - INTERFACE_WIDTH / 2,
            212,
            this.player.getMinerals() + '',
            { align: 'center', fill: "#ffffff", font: '24px 000webfont' }
        );
        this.interfaceGroup.add(this.mineralText);

        this.powerInterface.create(game, this.interfaceGroup);
    }

    update() {
        this.selector.update();
        this.miniMap.update();
        this.powerInterface.update();
        this.mineralText.text = Math.floor(this.player.getMinerals()) + '';
        this.UIUnitCreator.update();
        this.UIBuildingCreator.update();
    }
}
