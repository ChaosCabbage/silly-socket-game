var Logic = require("./GameRoomLogic");
var RoomIO = require("./GameRoomIO");

function GameRoom(io, room_name) {

    var logic = Logic();
    var room_io = RoomIO(io, room_name, logic);

    var delay = 50;
    var looper = null;

    var n = 0;

    var loop = function () {
        ++n;
        room_io.broadcastGameState();
    };

    var run = function () {
        if (looper == null) {
            console.log("Beginning main loop");
            looper = setInterval(loop, delay);
        }
    };

    this.addNewPlayer = room_io.playerJoinedLobby;
    this.run = run;
};

module.exports = GameRoom;