import {SCALE} from "../game_state/Play";
import {WorldKnowledge} from "../map/WorldKnowledge";
import {Unit} from "../unit/Unit";
import {Cell} from "../computing/Cell";
import {Player} from "../player/Player";
import {GAME_WIDTH} from "../../app";
import {INTERFACE_WIDTH} from "../interface/UserInterface";
import {MCV} from "../unit/MCV";
import {Army} from "../Army";
import {UnitProperties} from "../unit/UnitProperties";
import {Orca} from "../unit/Orca";
import {Helipad} from "../building/Helipad";
import {ACTION, MouseCursor} from "./MouseCursor";

export class PlayerCursor extends MouseCursor {
    private worldKnowledge: WorldKnowledge;
    private player: Player;

    constructor(worldKnowledge: WorldKnowledge, player: Player) {
        super();
        this.worldKnowledge = worldKnowledge;
        this.player = player;
    }

    create(game: Phaser.Game) {
        super.create(game);

        let green = new Phaser.Sprite(game, 0, 0, 'Outline', 6);
        green.scale.setTo(SCALE, SCALE);
        green.anchor.setTo(0.5, 0.5);
        green.fixedToCamera = true;
        game.add.existing(green);

        let red = new Phaser.Sprite(game, 0, 0, 'Outline2', 6);
        red.scale.setTo(SCALE, SCALE);
        red.anchor.setTo(0.5, 0.5);
        red.fixedToCamera = true;
        game.add.existing(red);

        let special = new Phaser.Sprite(game, 0, 0, 'Selected', 9);
        special.scale.setTo(SCALE, SCALE);
        special.fixedToCamera = true;
        special.anchor.setTo(0.5, 0.5);
        special.animations.add('fou', [9, 10, 11], 100).play(10, true, false);
        game.add.existing(special);

        this.cursors[ACTION.MOVE] = green;
        this.cursors[ACTION.ATTACK] = red;
        this.cursors[ACTION.SPECIAL] = special;

        this.showCursor(ACTION.DEFAULT);
    }

    update() {
        super.update();
        this.showCursor(this.getAction());
    }

    private showCursor(selectedAction: ACTION) {
        Object.keys(this.cursors).forEach((action) => {
            this.cursors[action].alpha = (+action) === selectedAction ? 1 : 0;
        });
    }

    private getAction(): ACTION {
        if (this.mousePointer.x > GAME_WIDTH - INTERFACE_WIDTH) {
            return ACTION.DEFAULT;
        }
        if (!this.hasUnitSelected()) {
            return ACTION.DEFAULT;
        }

        const unitAt = this.worldKnowledge.getGroundArmyAt(new PIXI.Point(
            Cell.realToCell(this.mousePointer.x + this.camera.position.x),
            Cell.realToCell(this.mousePointer.y + this.camera.position.y)
        ));
        if (unitAt && unitAt.getPlayer() !== this.player) {
            if (unitAt.isOnGround() || this.selectedUnitCanShootAir()) {
                return ACTION.ATTACK;
            } else {
                return ACTION.MOVE;
            }
        } else {
            if (this.isMCVExpanding(unitAt) || this.isOrcaReloading(unitAt)) {
                return ACTION.SPECIAL;
            }
            return ACTION.MOVE;
        }
    }

    private hasUnitSelected() {
        const selecteds = this.worldKnowledge.getSelectedArmies();
        for (let i = 0; i < selecteds.length; i++) {
            if (selecteds[i] instanceof Unit) {
                return true;
            }
        }

        return false;
    }

    private isMCVExpanding(unitAt: Army) {
        const selecteds = this.worldKnowledge.getSelectedArmies();
        return selecteds.length === 1 &&
                selecteds[0] instanceof MCV &&
                selecteds[0] === unitAt;
    }

    private isOrcaReloading(unitAt: Army) {
        const selecteds = this.worldKnowledge.getSelectedArmies();
        return selecteds.filter((unit) => {
            return unit instanceof Orca;
        }).length === selecteds.length && selecteds.filter((unit) => {
            return !(<Orca> unit).isFullyReloaded();
        }).length > 0 &&
        unitAt instanceof Helipad;
    }

    private selectedUnitCanShootAir() {
        const selecteds = this.worldKnowledge.getSelectedArmies();
        for (let i = 0; i < selecteds.length; i++) {
            if (selecteds[i] instanceof Unit && UnitProperties.getShootAirPower(selecteds[i].constructor.name) > 0) {
                return true;
            }
        }

        return false;
    }
}
