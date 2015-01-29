var debug = require('debug')('sillygame');
var app = require("./defaultapp");

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log( socket.id.toString() + " connected");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('position', function(pos){	
	socket.broadcast.emit('position', { id: socket.id, position: pos } );	
  });
});

module.exports = app;