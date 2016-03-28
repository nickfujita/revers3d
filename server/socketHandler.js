var gameDb = require('../db/gameModel').gameModel;
var utils = require('./utils');
var GameState = require('./GameState');

var masterState = new GameState();
// console.log('masterState.data:', masterState.data);

function createRoom(roomUrl, io) {
  return io.of(roomUrl, function(socket) {
    console.log('connection!', socket.id);

    socket.on('disconnect', function() {
      console.log('disconnect!', socket.id);
    })
  });
}

function connect(roomUrl, moves, io) {

  // TODO: make singleton task per connection. .of() registers listeners every
  // time a new connection is made.
  var room = io.of(roomUrl);
  // room.moves = [];
  room.gameState = utils.deepExtend({}, masterState);
  // console.log('room.gameState.data:', room.gameState.data);


  room.once('connection', function(client) {
    // Send the current state of the board to the client immediately on joining.

    client.emit('connectSuccess', room.gameState.data);
    // console.log('room.gameState.data:', room.gameState.data);

    client.on('event', function(data) {
      // Do some stuff
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!event');

      // Broadcast some stuff to everyone but source
      // client.broadcast.emit('drag', payload);
    });

    client.on('click', function(data) {
      // Do some stuff
      console.log('click!', data);

      // Broadcast some stuff to everyone but source
      client.broadcast.emit('click', data);
    });


    client.on('end', function() {
      var finishedStroke = client.stroke;

      //Get the game that the client is connected to.
      var id = client.nsp.name.slice(1);


      //Update the game with the new stroke.
      gameDb.update({roomId: roomId},{$push: {strokes: finishedStroke} },{upsert:true},function(err, board){
        if(err){ console.log(err); }
        else {
          console.log("Successfully added");
        }
      });

      // Emit end event to everyone but the person who stopped drawing.
      client.broadcast.emit('end', null);

      //Delete the stroke object to make room for the next stroke.
      delete client.stroke;
    });
  });
};

// Required by [server.js](../documentation/server.html)
module.exports = {
  connect: connect,
  createRoom: createRoom,

};
