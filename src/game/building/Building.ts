export interface Building {
    getCellPositions(): PIXI.Point[];
    create(game: Phaser.Game, group: Phaser.Group): void;
}
