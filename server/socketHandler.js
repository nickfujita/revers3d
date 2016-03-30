var utils = require('./utils');
var GameState = require('./GameState');
var gameDb = require('../db/gameModel').gameModel;

module.exports = {
  createGame: createGame,
};

function createGame(roomId, io) {
  var game = io.of('/play/' + roomId);
  game.on('connection', registerListeners);

  game.id = roomId;
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
    startData.playerNum = socket.playerNum = game.players.length;
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
    //  1. Add move to the move history
    //  2. Calculate the change in score
    //  3. Switch active player
    //  4. Is game over?
    //    4y. Broadcast the score
    //    4n. Broadcast what the move was, whos turn it is, and what the score is
    if(socket.id === game.players[turn]) {
      game.moves.push(move);
      gameDb.findOneAndUpdate({roomId: game.id}, {moves: game.moves});
      var dScore = game.gameState.capture(move, turn);
      game.scores[turn] += dScore;
      game.activePlayer = ~~!!!game.activePlayer;
      game.scores[game.activePlayer] -= (dScore - 1);

      if(game.scores.length === 52) {
        var message = '';
        var scores = game.scores;

        // Arrange scores and generate game over message.
        if(socket.hasOwnProperty('playerNum')) {
          scores = [game.scores[socket.playerNum], game.scores[!socket.playerNum]];
          if(game.scores[socket.playerNum] > game.scores[!socket.playerNum]) {
            message += 'Congratulations, you win!';
          } else {
            message += 'You lose :(';
          }
        } else {
          message += 'Game Over! Player ' + (scores[0] > scores[1] ? 1 : 2) + ' wins!';
        }

        socket.emit('game over', {message: message, scores: scores});
      } else {
        game.emit('receive move', {move: move, turn: turn, scores: game.scores});
      }
    }
  })

  /*
  ========================================
      On disconnections
  ========================================
   */

  if(socket.hasOwnProperty('playerNum')) {
    socket.on('disconnect', function() {
      game.emit('player leave', {playerNum: game.players.indexOf(socket.id), scores: game.scores})
      // console.log(socket.id, 'disconnected from', game.name);
    })
  }
}
