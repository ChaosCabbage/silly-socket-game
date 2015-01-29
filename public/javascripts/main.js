/*
	main.js file
*/

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
		onLoaded: function(){

			// example Joystix code
			
			// SimpleAvatar is just a div on the screen that moves around when you tell it to

			var player = new SimpleAvatar({
					$canvas: $('#layer2')[0],
					imageUrl: "images/you.jpg"
				}),
				// Joystix accepts the following options:
				//   $window		required	jQuery object representing the window
				//   keyboardSpeed 	optional	the speed a keyboard press should send. Defaults to 5.
				controller = new Joystix({
					$window: $(window)
				});
			

			controller.onMove(function(movement){
				// x1,y1,x2 and y2 here refer to the four axes
				// only x1 and y1 will be present for MultiTouch and keyboard
				// and yes they are analogue, normalised on a scale of 0 to 10
				// keyboard always sends 5 - you can change this with the 'keyboardSpeed' option passed to Joystix
				if(movement.x1){
					if(movement.x1>0){
						player.moveRight();
					}else if(movement.x1<0){
						player.moveLeft();
					}
				}
				if(movement.y1){
					if(movement.y1>0){
						player.moveDown();
					}else if(movement.y1<0){
						player.moveUp();
					}
				}
			});
			
			var socket = io();
			
			var otherGuysPositions = {};
			
			var otherGuyImage = new Image();
			otherGuyImage.src = "images/other.png";
			var ctx = $('#layer2')[0].getContext("2d");
			
			function drawGuy(pos) {
				ctx.drawImage(otherGuyImage, pos.x, pos.y);						
			}
			
			socket.on('position', function(data) {
				otherGuysPositions[data.id] = data.position;
			});
			
			var gameLoop = function() {
				socket.emit('position', { x: player.left, y: player.top } );
				player.draw();
				
				for(var guy in otherGuysPositions){
					drawGuy(otherGuysPositions[guy]);
				}				
				
				requestAnimationFrame(gameLoop);
			};
			
			gameLoop();

		},
		domready: true
	}).load();
});