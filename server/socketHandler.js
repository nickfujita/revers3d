var gameDb = require('../db/gameModel').gameModel;
var utils = require('./utils');
var GameState = require('./GameState');

module.exports = {
  createGame: createGame,
};

function createGame(roomId, io) {
  var game = io.of('/play/' + roomId);

  game.on('connection', registerListeners);
  game.moves = [];
  game.gameState = new GameState();
  game.activePlayer = 0;
}

function registerListeners(socket) {
  var game = this;

  /*
  ========================================
      On connections
  ========================================
   */

  socket.emit('connection', game.moves);
  socket.broadcast.emit('user connected', socket.id);

  console.log(socket.id, 'connected to', game.name);

  /*
  ========================================
      On game actions
  ========================================
   */

  socket.on('send move', function(move) {
    socket.broadcast.emit('receive move', move);

    game.moves.push(move);
    game.gameState.capture(move, game.activePlayer);
    game.activePlayer = ~~!!!game.activePlayer;
  })

  /*
  ========================================
      On disconnections
  ========================================
   */

  socket.on('disconnect', function() {
    console.log(socket.id, 'disconnected from', game.name);
  })
}
