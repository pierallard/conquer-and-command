/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./game/game_state/Boot";
import Preload from "./game/game_state/Preload";
import Play from "./game/game_state/Play";

class SimpleGame extends Phaser.Game {

    constructor()
    {
        super(
            1600,
            900,
            Phaser.AUTO, // Open GL for effect / shader ?
            'content',
            null,
            false,
            false,
            false,
        );

        this.antialias = false;
        this.state.add('Boot', Boot);
        this.state.add('Preload', Preload);
        this.state.add('Play', Play);
        this.state.start('Boot');
    }
}

window.onload = () => {
    new SimpleGame();
};
