
export default class Preload extends Phaser.State {
    public preload () {
        this.loadAudio();
        this.loadLevels();
        this.loadTileMaps();
        this.loadGameImages();
        this.loadFonts();
    }

    public create () {
        this.game.state.start('Play');
    }

    private loadAudio() {
    }

    private loadLevels() {
    }

    private loadTileMaps() {
        this.load.tilemap('basicmap', 'assets/basicmap.json', null, Phaser.Tilemap.TILED_JSON);
    }

    private loadGameImages() {
        // Units
        this.load.spritesheet('Tank11', 'assets/Tank11.png', 20, 20, 9, 0, 0);
        this.load.spritesheet('Tank5', 'assets/Tank5.png', 20, 20, 25, 0, 0);
        this.load.spritesheet('Tank3', 'assets/Tank3.png', 20, 20, 75, 0, 0);
        this.load.spritesheet('Tank12', 'assets/Tank12.png', 20, 20, 9, 0, 0);
        this.load.spritesheet('Builder2', 'assets/Builder2.png', 20, 20, 9, 0, 0);
        this.load.spritesheet('Transprt', 'assets/Transprt.png', 40, 40, 9, 0, 0);
        this.load.spritesheet('Scout2', 'assets/Scout2.png', 20, 20, 9, 0, 0);
        this.load.spritesheet('Tank7', 'assets/Tank7.png', 20, 20, 9, 0, 0);

        // Tiles
        this.load.spritesheet('GrssMisc', 'assets/GrssMisc.png', 20, 20, 40, 0, 0);
        this.load.spritesheet('GrasClif', 'assets/GrasClif.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Ice2Snow', 'assets/Ice2Snow.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Snow', 'assets/Snow.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Snw2Crtb', 'assets/Snw2Crtb.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('IceBrk2', 'assets/IceBrk2.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Grs2Watr', 'assets/Grs2Watr.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Grs2Mnt', 'assets/Grs2Mnt.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Snw2Mnt', 'assets/Snw2Mnt.png', 20, 20, 45, 0, 0);
        this.load.spritesheet('Stn2SnwB', 'assets/Stn2SnwB.png', 20, 20, 45, 0, 0);

        // Buildings
        this.load.spritesheet('Base', 'assets/Base.png', 60, 60, 8, 0, 0);
        this.load.spritesheet('Factory2', 'assets/Factory2.png', 40, 60, 24, 0, 0);
        this.load.spritesheet('Module', 'assets/Module.png', 40, 60, 1, 0, 0);
        this.load.spritesheet('Factory3', 'assets/Factory3.png', 40, 60, 11, 0, 0);
        this.load.spritesheet('Wall', 'assets/Wall.png', 20, 40, 52, 0, 0);
        this.load.spritesheet('GrssMisc-2060', 'assets/GrssMisc.png', 20, 60, 1, 0, 0);
        this.load.spritesheet('GrssCrtr', 'assets/GrssCrtr.png', 20, 20, 5, 0, 0);
        this.load.spritesheet('Generator', 'assets/Generator.png', 40, 60, 21, 0, 0);
        this.load.spritesheet('Turret', 'assets/Turret.png', 40, 40, 8, 0, 0);
        this.load.spritesheet('Artilery2', 'assets/Artilery2.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('MinerAni', 'assets/MinerAni.png', 40, 60, 21, 0, 0);
        this.load.spritesheet('Silo', 'assets/Silo.png', 40, 60, 1, 0, 0);
        this.load.spritesheet('Starport', 'assets/Starport.png', 40, 60, 8 * 3, 0, 0);

        // Others
        this.load.spritesheet('exploBig', 'assets/exploBig.png', 39, 39, 12, 1, 1);
        this.load.spritesheet('ArtlFlsh', 'assets/ArtlFlsh.png', 19, 19, 45, 1, 1);
        this.load.spritesheet('interface', 'assets/interface.png', 640, 360);
        this.load.spritesheet('buttons', 'assets/buttons.png', 33, 36, 4, 0, 0);
        this.load.spritesheet('button-progress', 'assets/button-progress.png', 33, 8, 1, 0, 0);
        this.load.spritesheet('Build1', 'assets/Build1.png', 80, 80, 14, 0, 0);
        this.load.spritesheet('Build2', 'assets/Build2.png', 80, 80, 12, 0, 0);
        this.load.spritesheet('Build3', 'assets/Build3.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('Build4', 'assets/Build4.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('Build5', 'assets/Build5.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('Build6', 'assets/Build6.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('Build7', 'assets/Build7.png', 80, 80, 8, 0, 0);
        this.load.spritesheet('Platform', 'assets/Platform.png', 40, 40, 31, 0, 0);
        this.load.spritesheet('Creation', 'assets/Creation.png', 40, 40, 23, 0, 0);
        this.load.spritesheet('interfacebuttons', 'assets/interfacebuttons.png', 12, 13, 4, 0, 0);
        this.load.spritesheet('interfaceprogress', 'assets/interfaceprogress.png', 10, 349, 1, 0, 0);
        this.load.spritesheet('interfacelimit', 'assets/interfacelimit.png', 10, 10, 2, 0, 0);
        this.load.spritesheet('Bullets', 'assets/Bullets.png', 9, 9, 36, 1, 1);
        this.load.spritesheet('Muzzle', 'assets/Muzzle.png', 20, 20, 64, 0, 0);
        this.load.spritesheet('Dark', 'assets/Dark.png', 20, 20, 14, 0, 0);
        this.load.spritesheet('Outline', 'assets/Outline.png', 20, 20, 13 * 5, 0, 0);
        this.load.spritesheet('Outline2', 'assets/Outline2.png', 20, 20, 13 * 5, 0, 0);
        this.load.spritesheet('mouse', 'assets/mouse.png', 20, 13, 1, 0, 0);
        this.load.spritesheet('Selected', 'assets/Selected.png', 20, 20, 12, 0, 0);
    }

    private loadFonts() {
    }
}
