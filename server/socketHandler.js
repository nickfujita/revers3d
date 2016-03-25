var Game = require('../db/gameModel').gameModel;

var connect = function(roomUrl, board, io) {
  // Set the socket.io namespace to the roomUrl.
  var room = io.of(roomUrl);

  room.once('connection', function(client) {
    // Send the current state of the board to the client immediately on joining.
    client.broadcast.emit('join', board);

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
      Game.update({roomId: roomId},{$push: {strokes: finishedStroke} },{upsert:true},function(err, board){
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
module.exports = connect;
