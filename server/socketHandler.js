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
  game.players = [];
}

function registerListeners(socket) {
  var game = this;

  /*
  ========================================
      On connections
  ========================================
   */


  if(game.players.length < 2) {
    socket.emit('connection', {playerNum: game.players.length});
    game.players.push(socket.id);
  } else {
    socket.emit('connection', {moves: game.moves, turn: game.activePlayer});
  }

  socket.broadcast.emit('user connected', socket.id);

  /*
  ========================================
      On game actions
  ========================================
   */

  socket.on('send move', function(move) {
    var turn = game.activePlayer;

    if(socket.id === game.players[turn]) {
      game.moves.push(move);
      game.gameState.capture(move, turn);
      game.emit('receive move', {move: move, turn: turn});

      game.activePlayer = ~~!!!game.activePlayer;
    }
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
