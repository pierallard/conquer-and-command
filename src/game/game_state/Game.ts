import {MouseCursor} from "../cursor/MouseCursor";

export default class Game extends Phaser.State {
    private cursor: MouseCursor;

    private players: Phaser.Text[];

    constructor() {
        super();

        this.cursor = new MouseCursor();
        this.players = [];
    }

    public create(game: Phaser.Game) {
        this.cursor.create(game);

        const player0 = new Phaser.Text(game, 100, 100, 'Waiting...',
            { align: 'center', fill: "#ffffff", font: '24px 000webfont' }
        );
        const player1 = new Phaser.Text(game, 400, 100, 'Waiting...',
            { align: 'center', fill: "#ffffff", font: '24px 000webfont' }
        );

        game.add.existing(player0);
        game.add.existing(player1);

        this.players[0] = player0;
        this.players[1] = player1;

        this.connect();

        // this.game.state.start('Play');
    }

    public connect() {
        const conn = new WebSocket('ws://localhost:8081');

        conn.onopen = function () {
            console.log('open');
        };

        conn.onmessage = function (e) {
            const message = JSON.parse(e.data);
            switch (message.action) {
                case 'newClient':
                    const clientId = parseInt(message.value);
                    this.players[clientId].setText('Connected!');
            }
        }.bind(this);

        conn.onerror = function() {
            console.log('error');
        };
    }

    public update() {
        this.cursor.update();
    }
}
