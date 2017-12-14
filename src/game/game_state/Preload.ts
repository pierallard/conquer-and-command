
export default class Preload extends Phaser.State {

    public preload ()
    {
        this.loadAudio();
        this.loadLevels();
        this.loadTileMaps();
        this.loadGameImages();
        this.loadFonts();
    }

    public create ()
    {
        this.game.state.start('Play');
    }

    private loadAudio()
    {
    }

    private loadLevels()
    {
    }

    private loadTileMaps()
    {
        this.load.tilemap('basicmap', 'assets/basicmap.json', null, Phaser.Tilemap.TILED_JSON);
    }

    private loadGameImages()
    {
        this.load.spritesheet('Circle', 'assets/circle.png', 500, 500);
        this.load.spritesheet('Tank11', 'assets/Tank11.png', 19, 19, 9, 1, 1);
        this.load.spritesheet('Tank12', 'assets/Tank12.png', 19, 19, 9, 1, 1);
        this.load.spritesheet('Builder2', 'assets/Builder2.png', 19, 19, 9, 1, 1);
        this.load.spritesheet('Tank5c', 'assets/Tank5c.png', 19, 19, 25, 1, 1);
        this.load.spritesheet('exploBig', 'assets/exploBig.png', 39, 39, 12, 1, 1);
        this.load.spritesheet('ArtlFlsh', 'assets/ArtlFlsh.png', 19, 19, 45, 1, 1);
        this.load.spritesheet('GrssMisc', 'assets/GrssMisc.png', 20, 20, 40, 0, 0);
        this.load.spritesheet('GrasClif', 'assets/GrasClif.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Base', 'assets/Base.png', 60, 60, 8, 0, 0);
        this.load.spritesheet('Cube', 'assets/Cube.png', 23, 27, 21, 1, 1);
    }

    private loadFonts()
    {
    }
}
