import {Cell} from "../computing/Cell";
import {ConstructableBuilding} from "./ConstructableBuilding";
import {HelipadSprite} from "../sprite/HelipadSprite";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Player} from "../player/Player";
import {BuildingProperties} from "./BuildingProperties";

export class Helipad extends ConstructableBuilding {
    private loading: boolean;

    constructor(worldKnowledge: WorldKnowledge, cellPosition: PIXI.Point, player: Player) {
        super(worldKnowledge, cellPosition, player);

        this.loading = false;
    }

    create(game: Phaser.Game, groups: Phaser.Group[]) {
        this.sprite = new HelipadSprite(
            game,
            groups,
            Cell.cellToReal(this.cellPosition.x),
            Cell.cellToReal(this.cellPosition.y),
            BuildingProperties.getSpriteKey(this.constructor.name, this.player.getId())
        );
    }

    runLoadAnimation() {
        (<HelipadSprite> this.sprite).runLoadAnimation();
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    isLoading(): boolean {
        return this.loading;
    }
}
