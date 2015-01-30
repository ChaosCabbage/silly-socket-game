var Player = require("./player");

function GameRoom(io, room_name) {
	
	var Logic = {
	
		players : [],
		
		allClasses: ["Ice", "Fire", "Earth", "Gimp"],
		
		availableClasses: function() {
			var classes_playing = players.map(function(player) { return player.data().class; });
			return allClasses.filter(function(class) {
				return (classes_playing.indexOf(class) == -1) || (class == "Gimp");
			});						
		},		
		
		currentPlayersState: function() {
			return players.map(function(player) { return player.data(); })
		},

		currentFullState: function() {
			return {
				classes: allClasses,
				players: currentPlayersState()
			};
		},
		
		isAllowedToJoin: function(join_request) {
			return (availableClasses().indexOf(join_request.class) != -1);
		},
		
		addPlayerToGame(player) {
			players.push(player);
		}
	
	};
	
	var IO = {
	
		playerJoinedLobby : function(player_socket)	{
			socket.join(room_name);
			player_socket.emit("joined lobby", Logic.currentState());
			
			player_socket.on("join game", function(data) {
				playerTriesToJoinGame(player_socket, data);
			});			
		},
		
		playerTriesToJoinGame: function(socket, join_request) {
			if (Logic.isAllowedToJoin(join_request)) {
				Logic.addPlayerToGame(new Player(socket, join_request.class));
			} else {
				socket.emit("failed to join", {reason: "Class taken"});
			}
		},
		
		broadcastGameState: function() {
			io.sockets.in(room_name).emit("position update", Logic.currentPlayersState());
		}
		
		
	};
	
	this.addNewPlayer = IO.playerJoinedLobby;

}


module.exports = GameRoom;