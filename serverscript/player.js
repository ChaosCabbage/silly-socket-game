
// Ok, preferably there'd be some kind of map collision
// system going on, but this'll do for now.
function corrected_move(old_pos, new_pos) {
	return new_pos;
}

// Player object
//
// methods: data()
function Player(socket, job, name) {

	var my_pos = { x: 50, y: 50 };
	
	socket.on("try move", function (move) {
	    var newX = parseInt(move.x);
	    var newY = parseInt(move.y);

        if (!isNaN(newX) && !isNaN(newY)) {
	        my_pos = corrected_move(my_pos, { x: newX, y: newY } );
	    } else {
	        console.log("Your numbers were shit");
	    }
	});
	
	this.data = function() {
		return {
			job: job
			, pos: my_pos
			, name: name
		};
	};	
	
	this.id = socket.id;

	console.log("Created player " + name + " as " + job + ". -- id " + socket.id);
}

module.exports = Player;