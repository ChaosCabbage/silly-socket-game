class LobbyState {

    game: Phaser.Game;
    socket: Socket;
    players: PlayerData[];
    you: string;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    init = (socket: Socket, data: any, yourName: string) => {
        this.players = data.players;
        this.socket = socket;
        this.you = yourName;
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

        this.socket.emit("join game", { job: "Gimp" });

        this.socket.on("failed to join", function () {
            alert("Sad face");
        });

        this.game.state.start("TheGame", true, false, this.socket, this.you, this.players);
    }

}
