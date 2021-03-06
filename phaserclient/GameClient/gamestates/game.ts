﻿class Emitter {

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


class PlayerNameMap {
    [key: string]: PlayerData;
}




var toNameMap = (players: PlayerData[]): PlayerNameMap => {
    var map = new PlayerNameMap;

    players.forEach((p: PlayerData) => {
        map[p.name] = p;
    });

    return map;
}






class GameState {

    game: Phaser.Game;
    socket: Socket;
    yourName: string;
    serverPlayers: PlayerNameMap;

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

        if (playerMap[this.yourName] != undefined) {
            var you = playerMap[this.yourName];
            this.reconciler.update(you.pos);
        }

        delete playerMap[this.yourName];

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

            this.addNameAsChildSprite(player, this.yourName);

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

        var dx = 0;
        var dy = 0;

        if (cursors.left.isDown) {  dx -= 100; }
        if (cursors.right.isDown) { dx += 100; }
        if (cursors.up.isDown) {    dy -= 100; }
        if (cursors.down.isDown) { dy += 100; }

        player.body.velocity.x = dx;
        player.body.velocity.y = dy;

        if (dx == 0 && dy == 0) { player.animations.stop(); }
        else if (dx < 0) { player.play("left"); } 
        else if (dx > 0) { player.play("right"); }
        else if (dy < 0) { player.play("up"); }
        else if (dy > 0) { player.play("down"); }
        
    }


    addNameAsChildSprite(sprite: Phaser.Sprite, name: string) {
        var text = this.game.add.text(0, -20, name, { font: "12px Arial", fill: "#ffff00", align: "center" });
        text.anchor.set(0.5, 0);
        sprite.addChild(text);
    }


    extraSprites: Phaser.Sprite[] = [];
    
    render = () => {
        //this.game.debug.body(this.player);

        this.extraSprites.forEach((s: Phaser.Sprite) => {
            s.destroy();
        });
        
        this.extraSprites = [];
        
        for (var p in this.serverPlayers) {
            var player = this.serverPlayers[p];
            var newS = this.game.add.sprite(player.pos.x, player.pos.y, 'player', 2);
            this.addNameAsChildSprite(newS, player.name);
            this.extraSprites.push(newS);
        };

    }
}
