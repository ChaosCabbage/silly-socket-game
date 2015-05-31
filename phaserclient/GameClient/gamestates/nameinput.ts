class NameInputState {

    game: Phaser.Game;
    socket: Socket;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    preload = () => {
        
    }

    init = (socket: Socket) => {
        this.socket = socket;
    }

    create = () => {

        var name = "Jerome";
        var join = () => { this.socket.emit("join lobby", { name: name }); };

        join();

        this.socket.on("joined lobby",(data) => {
            this.game.state.start("Lobby", true, false, this.socket, data, name);
        });

        this.socket.on("name taken",() => {
            name = name + "_2";
            join();
        });      
    }
}
