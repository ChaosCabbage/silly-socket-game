var Player = require("./player");

var GameRoomIO = function(io, room_name, room_logic) {
	
    var playerTriesToJoinGame = function (socket, join_request) {
        console.log(socket.id + " trying to join with " + JSON.stringify(join_request));
        if (room_logic.isAllowedToJoin(join_request)) {
            room_logic.addPlayerToGame(new Player(socket, join_request.job));
            socket.on("disconnect", function () {
                room_logic.removePlayerById(socket.id);
            });
		} else {
			socket.emit("failed to join", {reason: "Class taken"});
		}
	};

	var playerJoinedLobby = function(player_socket)	{
	    player_socket.join(room_name);
		player_socket.emit("joined lobby", room_logic.currentFullState());
		
		player_socket.on("join game", function(data) {
			playerTriesToJoinGame(player_socket, data);
		});			
	};
	
	var broadcastGameState = function() {
		io.sockets.in(room_name).emit("position update", room_logic.currentPlayersState());
	};
	
	
	return {
		playerJoinedLobby : playerJoinedLobby
		, broadcastGameState : broadcastGameState
	};	
};

module.exports = GameRoomIO;