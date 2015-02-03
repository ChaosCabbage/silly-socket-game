//
//	main.js file
//

require.config({
  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    'socketio': {
      exports: 'io'
    }
  },
  paths: {
    socketio: 'https://cdn.socket.io/socket.io-1.3.2'
  }
});

require(['lib/DependencyLoader',
		 'joystix/Joystix',
		 'SimpleAvatar',
		 'socketio'],
function(DependencyLoader,
		 Joystix,
		 SimpleAvatar,
		 io){
	'use strict';

	new DependencyLoader({
	    onLoaded: function () {

	        var game_assets = {
	            gameboard: $("#gameboard")[0],
	            canvases: [$("#layer1")[0], $("#layer2")[0]],
	            choosebuttons: {
	                all :  $("#choosejob")[0],
	                ice:   $("#chooseice")[0],
	                fire:  $("#choosefire")[0],
	                earth: $("#chooseearth")[0],
                    gimp:  $("#choosegimp")[0]
	            },
	            images: {
	                Ice:   $("#iceimage")[0],
	                Fire:  $("#fireimage")[0],
	                Earth: $("#earthimage")[0],
	                Gimp:  $("#gimpimage")[0]
	            }
	        };

	        var current_players = [];

	        var socket = io();

	        var setup_buttons = function () {
	            function join_game(job) {
	                socket.emit("join game", { job: job });
	                game_assets.choosebuttons.all.style.display = "none";
	            };

	            $(game_assets.choosebuttons.ice).click(function () { join_game("Ice"); });
	            $(game_assets.choosebuttons.fire).click(function () { join_game("Fire"); });
	            $(game_assets.choosebuttons.earth).click(function () { join_game("Earth"); });
	            $(game_assets.choosebuttons.gimp).click(function () { join_game("Gimp"); });
	        };

	        var setup_controls = function () {
	            // Joystix accepts the following options:
	            //   $window		required	jQuery object representing the window
	            //   keyboardSpeed 	optional	the speed a keyboard press should send. Defaults to 5.
	            var controller = new Joystix({
	                $window: $(window)
	            });

	            var x_move = 0;
	            var y_move = 0;
	            controller.onMove(function (movement) {
	                x_move += movement.x1;
	                y_move += movement.y1;
	            });

	            var emit_move = function () {
	                socket.emit("try move", { x: x_move, y: y_move });
	                x_move = 0;
	                y_move = 0;
	            };

	            setInterval(emit_move, 50);
	        };

	        socket.on("joined lobby", function (data) {
	            setup_buttons();
	            setup_controls();
	            game_assets.gameboard.style.display = "inline";
	            current_players = data.players;
	        });

	        socket.on("failed to join", function () {
	            game_assets.choosebuttons.all.style.display = "inline";
	        });

	        socket.on("position update", function (data) {
	            current_players = data;
	        });

			
			var ctx = game_assets.canvases[1].getContext("2d");

			function drawGuy(player) {
			    var x = player.pos.x;
			    var y = player.pos.y;
			    ctx.drawImage(game_assets.images[player.job], x, y);
			}
			
			var gameLoop = function () {

			    ctx.clearRect(0, 0, game_assets.canvases[1].width, game_assets.canvases[1].height);
				
			    for (var i = 0; i < current_players.length; i++) {
			        drawGuy(current_players[i]);
			    }	
				
				requestAnimationFrame(gameLoop);
			};
			
			gameLoop();

		},
		domready: true
	}).load();
});