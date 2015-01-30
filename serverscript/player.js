
function vector_add(a, b) {
	return {
		x: (a.x + b.x),
		y: (a.y + b.y)
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
function Player(socket, job) {

	var my_pos = { x: 50, y:50 };
	
	socket.on("try move", function(move) {
		my_pos = corrected_move(my_pos, move);
	});
	
	this.data = function() {
		return {
			class: job,
			pos: my_pos
		};
	};	
	
	this.id = socket.id;
}

module.exports = Player;