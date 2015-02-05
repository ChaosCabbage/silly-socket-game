var server = require("./server");
var GameRoom = require("./GameRoom");

var io = require('socket.io').listen(server);

var mainRoom = GameRoom(io, "the");

mainRoom.run();

io.on('connection', function(socket){
  console.log( socket.id.toString() + " connected");
  socket.on('disconnect', function(){
    console.log(socket.id.toString() + " disconnected");
  });

  socket.on("join lobby", function(data) {
	  if (mainRoom.nameIsAvailable(data.name)) {
		mainRoom.addNewPlayer(socket, data.name);
		socket.removeAllListeners("join lobby");
	  } else {
		  socket.emit("name taken");
	  }
  });
  

});

module.exports = server;