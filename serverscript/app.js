var server = require("./server");
var GameRoom = require("./GameRoom");

var io = require('socket.io').listen(server);

var mainRoom = new GameRoom(io, "the");

mainRoom.run();

io.on('connection', function(socket){
  console.log( socket.id.toString() + " connected");
  socket.on('disconnect', function(){
    console.log(socket.id.toString() + " disconnected");
  });
  
  mainRoom.addNewPlayer(socket);
});

module.exports = server;