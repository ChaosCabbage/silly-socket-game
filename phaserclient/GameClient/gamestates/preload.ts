class PreloadState {

    game: Phaser.Game;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    preload = () => {

        var loadingBar = this.game.add.sprite(160, 240, "loading");
        loadingBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(loadingBar);
        
        this.game.load.tilemap('map', 'assets/tilemaps/csv/catastrophi_level2.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
        this.game.load.spritesheet('player', 'assets/sprites/spaceman.png', 16, 16);
    }

    create = () => {
        var socket = io("http://localhost:3000");

        this.game.state.start("NameInput", true, false, socket);
    }
    
}
