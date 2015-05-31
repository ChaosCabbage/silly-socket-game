class Emitter {

    socket: Socket;
    frames: number;
    player: Phaser.Sprite;
    

    constructor(socket: Socket, player: Phaser.Sprite) {
        this.socket = socket;
        this.player = player;
        this.frames = 0;
    }   

    emit() {
        this.socket.emit("try move", { x: this.player.body.position.x, y: this.player.body.position.y });
    }
}

class PositionReconciler {

    updated: boolean;
    reportedPosition: Point;

    constructor(player: Phaser.Sprite) {
        this.updated = false;
        this.reportedPosition = { x: player.body.position.x, y: player.body.position.y };        
    }

    update(pos: Point) {
        this.reportedPosition = pos;
        this.updated = true;
    }

    updateWaiting(): boolean {
        return this.updated;
    }

    read(): Point {
        this.updated = false;
        return this.reportedPosition;
    }
}



var toNameMap = (players: PlayerData[]): Map <string, PlayerData>  => {
    var map = new Map<string, PlayerData>();

    players.forEach((p: PlayerData) => {
        map.set(p.name, p);
    });

    return map;
}




class GameState {

    game: Phaser.Game;
    socket: Socket;
    yourName: string;
    serverPlayers: Map<string, PlayerData>;

    layer: Phaser.TilemapLayer;
    cursors: Phaser.CursorKeys;
    player: Phaser.Sprite;

    emitter: Emitter;
    reconciler: PositionReconciler;



    constructor(game: Phaser.Game) {
        this.game = game;
    }

    init = (socket: Socket, yourName: string, players: PlayerData[]) => {
        this.socket = socket;
        this.yourName = yourName;
        this.serverPlayers = toNameMap(players);
    }

    processPlayerDataUpdate(data: PlayerData[]) {
        var playerMap = toNameMap(data);

        if (playerMap.has(this.yourName)) {
            var you = playerMap.get(this.yourName);
            this.reconciler.update(you.pos);
        }

        playerMap.delete(this.yourName);

        this.serverPlayers = playerMap;       
    }

    create = () => {

        //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
        var map = this.game.add.tilemap('map', 16, 16);

        //  Now add in the tileset
        map.addTilesetImage('tiles');
    
        //  Create our layer
        this.layer = map.createLayer(0);

        //  Resize the world
        this.layer.resizeWorld();
        
        //  This isn't totally accurate, but it'll do for now
        map.setCollisionBetween(54, 83);

        //  Un-comment this on to see the collision tiles
        //this.layer.debug = true;

        //  Player
        this.player = (() => {
            var player = this.game.add.sprite(48, 48, 'player', 1);
            player.animations.add('left', [8, 9], 10, true);
            player.animations.add('right', [1, 2], 10, true);
            player.animations.add('up', [11, 12, 13], 10, true);
            player.animations.add('down', [4, 5, 6], 10, true);

            this.game.physics.enable(player, Phaser.Physics.ARCADE);

            player.body.setSize(10, 14, 2, 1);
            return player;
        })();


        this.game.camera.follow(this.player);

        //  Allow cursors to scroll around the map
        this.cursors = this.game.input.keyboard.createCursorKeys();

        var help = this.game.add.text(16, 16, 'Arrows to move', { font: '14px Arial', fill: '#ffffff' });
        help.fixedToCamera = true;

        this.emitter = new Emitter(this.socket, this.player);
        this.reconciler = new PositionReconciler(this.player);
        
        this.socket.on("position update",(data) => {
            this.processPlayerDataUpdate(data);
        });
    }

    update = () => {

        var player = this.player;
        var layer = this.layer;
        var cursors = this.cursors;

        if (this.reconciler.updateWaiting()) {
            var pos = this.reconciler.read();
            this.player.body.position.setTo(pos.x, pos.y);
        }

        this.game.physics.arcade.collide(player, layer);

        this.emitter.emit();

        player.body.velocity.set(0);

        if (cursors.left.isDown) {
            player.body.velocity.x = -100;
            player.play('left');
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 100;
            player.play('right');
        }
        else if (cursors.up.isDown) {
            player.body.velocity.y = -100;
            player.play('up');
        }
        else if (cursors.down.isDown) {
            player.body.velocity.y = 100;
            player.play('down');
        }
        else {
            player.animations.stop();
        }

    }


    extraSprites: Phaser.Sprite[] = [];
    
    render = () => {
        //this.game.debug.body(this.player);

        this.extraSprites.forEach((s: Phaser.Sprite) => {
            s.destroy();
        });

        this.extraSprites = [];

        this.serverPlayers.forEach((p: PlayerData) => {
            var newS = this.game.add.sprite(p.pos.x, p.pos.y, 'player', 2);
            this.extraSprites.push(newS);
        });

    }
}
