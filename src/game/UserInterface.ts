import {SCALE} from "./game_state/Play";
import {UIUnitCreator} from "./creator/UnitCreator";
import {WorldKnowledge} from "./WorldKnowledge";
import {UIBuildingCreator} from "./creator/UIBuildingCreator";
import {Minimap} from "./map/Minimap";
import {Player} from "./player/Player";
import {BuildingPositionner} from "./BuildingPositionner";
import {Selector} from "./Selector";

export const INTERFACE_WIDTH = 160;

export class UserInterface {
    private buildingCreator: UIBuildingCreator;
    private interfaceGroup: Phaser.Group;
    private unitCreator: UIUnitCreator;
    private minimap: Minimap;
    private player: Player;
    private selector: Selector;
    private buildingPositionner: BuildingPositionner;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        this.player = player;
        this.selector = new Selector(worldKnowledge, player);
        this.buildingPositionner = new BuildingPositionner(worldKnowledge);
        this.buildingCreator = new UIBuildingCreator(worldKnowledge, this.player, this.buildingPositionner);
        this.unitCreator = new UIUnitCreator(worldKnowledge, this.player);
        this.minimap = new Minimap(worldKnowledge);
        worldKnowledge.setCreators([this.buildingCreator, this.unitCreator]);
    }

    create(game: Phaser.Game) {
        this.buildingPositionner.create(game);
        this.selector.create(game);

        this.interfaceGroup = game.add.group();
        this.interfaceGroup.fixedToCamera = true;

        let interfaceSprite = new Phaser.Sprite(game, 0, 0, 'interface');
        interfaceSprite.scale.setTo(SCALE);
        this.interfaceGroup.add(interfaceSprite);

        this.unitCreator.create(game, this.interfaceGroup);
        this.buildingCreator.create(game, this.interfaceGroup);
        this.minimap.create(game);
    }

    update() {
        this.selector.update();
        this.minimap.update();
    }
}
