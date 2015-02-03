var GameRoomLogic = function() {
	
	var players = [];
	var allClasses = ["Ice", "Fire", "Earth", "Gimp"];
	
	// A player can only choose classes which aren't already in play.
	// Except for Gimp. Anybody can be a Gimp.
	var availableClasses = function() {
		var classes_playing = players.map(function(player) { 
			return player.data().job; 
		});
		return allClasses.filter(function(job) {
			return (classes_playing.indexOf(job) == -1) || (job == "Gimp");
		});						
	};
	
	var currentPlayersState = function() {
		return players.map(function(player) { 
			return player.data(); 
		});
	};
	
	var currentFullState = function() {
		return {
			  classes: allClasses
			, players: currentPlayersState()
		};
	};
	
	var isAllowedToJoin = function(join_request) {
		return (availableClasses().indexOf(join_request.job) != -1);
	};
	
	var addPlayerToGame = function(player) {
		players.push(player);
	};

	return { 
		  players : players
		, allClasses: allClasses
		, availableClasses: availableClasses
		, currentPlayersState: currentPlayersState
		, currentFullState: currentFullState
		, isAllowedToJoin: isAllowedToJoin
		, addPlayerToGame: addPlayerToGame
	};
};

module.exports = GameRoomLogic;