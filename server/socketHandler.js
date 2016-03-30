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
  game.scores = [2, 2];
}

function registerListeners(socket) {
  var game = this;

  /*
  ========================================
      On connections
  ========================================
   */
  var startData = {moves: game.moves, turn: game.activePlayer};

  if(game.players.length < 2) {
    startData.playerNum = game.players.length;
    socket.emit('connection', startData);
    game.players.push(socket.id);
  } else {
    socket.emit('connection', startData);
  }

  socket.broadcast.emit('user connected', socket.id);

  /*
  ========================================
      On game actions
  ========================================
   */

  socket.on('send move', function(move) {
    var turn = game.activePlayer;

    // if move is valid:
    //  1. Add move to the move history (game.moves)
    //  2. Calculate the change in score (dScore)
    //  3. Switch active player
    //  4. Is game over?
    //    4y. Broadcast the score
    //    4n. Broadcast what the move was, whos turn it is, and what the score is

    if(socket.id === game.players[turn]) {
      game.moves.push(move);
      var dScore = game.gameState.capture(move, turn);
      game.scores[turn] += dScore;
      game.activePlayer = ~~!!!game.activePlayer;
      game.scores[game.activePlayer] -= (dScore - 1);

      console.log('game.moves.length:', game.moves.length);

      game.moves.length === 52 ?
        game.emit('game over', {scores: game.scores})
        : game.emit('receive move', {move: move, turn: turn, scores: game.scores});
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
