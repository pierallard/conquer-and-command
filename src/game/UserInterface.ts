import {SCALE} from "./game_state/Play";
import {UnitCreator} from "./creator/UnitCreator";
import {WorldKnowledge} from "./WorldKnowledge";
import {BuildingCreator} from "./creator/BuildingCreator";
import {Minimap} from "./map/Minimap";
import {Player} from "./player/Player";
import {BuildingPositionner} from "./BuildingPositionner";

export class UserInterface {
    private buildingCreator: BuildingCreator;
    private interfaceGroup: Phaser.Group;
    private unitCreator: UnitCreator;
    private minimap: Minimap;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player, buildingPositionner: BuildingPositionner) {
        this.player = player;
        this.buildingCreator = new BuildingCreator(worldKnowledge, this.player, buildingPositionner);
        this.unitCreator = new UnitCreator(worldKnowledge, this.player);
        this.minimap = new Minimap(worldKnowledge);
        worldKnowledge.setCreators([this.buildingCreator, this.unitCreator]);
    }

    create(game: Phaser.Game) {
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
        this.minimap.update();
    }
}
