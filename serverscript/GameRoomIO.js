var Player = require("./player");

var GameRoomIO = function(io, room_name, room_logic) {
	
	var lobby = (function() {
		var names = [];
		
		return {
			nameIsAvailable: function(name) {
				return (names.indexOf(name) == -1);
			}
		
			, add: function(name) {	
				names.push(name); 
			}
			
			, remove: function(name) {  
				names.splice(names.indexOf(name), 1); 
			}
		};
	})();
	
    var tryToJoinGame = function (socket, join_request, name) {
        console.log(socket.id + " trying to join with " + JSON.stringify(join_request));
        if (room_logic.isAllowedToJoin(join_request)) {
            room_logic.addPlayerToGame(new Player(socket, join_request.job, name));
			socket.removeAllListeners("join game");
		} else {
			socket.emit("failed to join", {reason: "Class taken"});
		}
	};

	var playerJoinedLobby = function(player_socket, name)	{
	    player_socket.join(room_name);
		lobby.add(name);
		player_socket.emit("joined lobby", room_logic.currentFullState());
		
		player_socket.on("join game", function(data) {
			tryToJoinGame(player_socket, data, name);
		});			
		
		player_socket.on("disconnect", function () {
			room_logic.removePlayerById(player_socket.id);
			lobby.remove(name);
        });
	};
	
	var broadcastGameState = function() {
		io.sockets.in(room_name).emit("position update", room_logic.currentPlayersState());
	};
	
	return {
		playerJoinedLobby : playerJoinedLobby
		, broadcastGameState : broadcastGameState
		, nameIsAvailable: lobby.nameIsAvailable
	};	
};

module.exports = GameRoomIO;