/*
	alternative main file
	Just shows some stats and lets you communicate with the server
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
		 'socketio'],
function(DependencyLoader,
		 io){
	'use strict';

	new DependencyLoader({
	    onLoaded: function () {

	        var connect = document.getElementById("connect");

	        var ice = document.getElementById("ice");
	        var fire = document.getElementById("fire");
	        var earth = document.getElementById("earth");
	        var gimp = document.getElementById("gimp");

	        function showJobs() {
	            document.getElementById("jobs").style.display = "inline";
	        };

	        function showMove() {
	            document.getElementById("movement").style.display = "inline";
	        };

	        connect.addEventListener("click", function () {
	            var socket = io();

	            function assignClickToJob(button, job) {
	                button.addEventListener("click", function () {
	                    alert("Joining as " + job);
	                    socket.emit("join game", { job: job });
	                });
	            }

	            function assignClicksToJobs() {
	                assignClickToJob(ice, "Ice");
	                assignClickToJob(fire, "Fire");
	                assignClickToJob(earth, "Earth");
	                assignClickToJob(gimp, "Gimp");
	            };

	            function assignMovement() {
	                var x = document.getElementById("x");
	                var y = document.getElementById("y");
	                var move = document.getElementById("move");

	                move.addEventListener("click", function () {
	                    socket.emit("try move", { x: x.value, y: y.value });
	                });
	            };

	            socket.on("joined lobby", function (data) {
	                var string = JSON.stringify(data).replace(/\n/g, "<br />");
	                document.getElementById("gamestate").innerHTML = string;

	                showJobs();
	                showMove();
	                assignClicksToJobs();
	                assignMovement();

	                socket.on("position update", function (data) {
	                    var string = JSON.stringify(data).replace(/\n/g, "<br />");
	                    document.getElementById("gamestate").innerHTML = string;
	                });

	                socket.on("failed to join", function(data) {
	                    alert("Failed: " + JSON.stringify(data));
	                });
	            });

                

                
	        });			

		},
		domready: true
	}).load();
});