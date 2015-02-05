
function vector_add(a, b) {
	return {
		  x: (a.x + b.x)
		, y: (a.y + b.y)
	};
}

// Ok, preferably there'd be some kind of map collision
// system going on, but this'll do for now.
function corrected_move(old_pos, move) {
    var new_pos = vector_add(old_pos, move);
	
	var mapheight = 675;
	var mapwidth = 1125;
	
	var left_warp = -60;
	var top_warp = -180;
	
	if (new_pos.y < left_warp) {
		new_pos.y = mapheight;
	}
	
	if (new_pos.y > mapheight) {
		new_pos.y = left_warp;
	}

	if (new_pos.x < top_warp) {
		new_pos.x = mapwidth;
	}
	
	if (new_pos.x > mapwidth) {
		new_pos.x = top_warp;
	}
	
	return new_pos;
}

// Player object
//
// methods: data()
function Player(socket, job, name) {

	var my_pos = { x: 50, y: 50 };
	
	socket.on("try move", function (move) {
	    var dx = parseInt(move.x);
	    var dy = parseInt(move.y);

        if (!isNaN(dx) && !isNaN(dy)) {
	        my_pos = corrected_move(my_pos, { x: dx, y: dy } );
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