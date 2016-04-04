var utils = require('./utils');
var GameState = require('./GameState');
var gameDb = require('../db/gameModel').gameModel;

module.exports = {
  createGame: createGame,
};

function createGame(roomId, io) {
  var game = io.of('/game/' + roomId);
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
  var startData = {moves: game.moves, turn: game.activePlayer, score: game.scores};

  if(game.players.length < 2) {
    startData.playerNum = socket.playerNum = game.players.length;
    socket.emit('connection', startData);
    game.players.push(socket.id);
    gameDb.findOneAndUpdate({roomId: game.id}, {players: game.players}, function(err) {
      if(err) console.error('DB error adding player', err);
    });
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
      gameDb.findOneAndUpdate({roomId: game.id}, {moves: game.moves}, function(err){
        if(err) console.error('DB error updating moves', err);
      });
      var dScore = game.gameState.capture(move, turn);
      game.scores[turn] += dScore;
      game.activePlayer = ~~!!!game.activePlayer;
      game.scores[game.activePlayer] -= (dScore - 1);

      // console.log('game.moves:', game.moves);

      if(game.moves.length === 52) {
        var message = 'Game Over! ';
        var scores = game.scores;

        // Arrange scores and generate game over message.
        if(socket.hasOwnProperty('playerNum')) {
          // Game over message for players
          scores = [game.scores[socket.playerNum], game.scores[1 - socket.playerNum]];
          if(scores[0] === scores[1]) {
            message += 'Tie!'
          } else {
            message += scores[0] > scores[1] ? 'Congratulations, you win!' : 'You lose :(';
          }
        } else {
          // Game over message for spectators
          if(scores[0] === scores[1]) {
            message += 'It\'s a tie!';
          } else {
            message += 'Player ' + (scores[0] > scores[1] ? 1 : 2) + ' wins!';
          }
        }

        game.emit('game over', {message: message, scores: scores});
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
      var playerNum = game.players.indexOf(socket.id);
      game.emit('player leave', {playerNum: playerNum, scores: game.scores});
      game.players.splice(playerNum, 1);


      // If there are no players left, remove the game from the collection.
      if(!game.players.length) {
        gameDb.remove({roomId: game.id}, function(err) {
          if(err) console.error('DB error deleting game', err);
        });
      } else {
        gameDb.findOneAndUpdate({roomId: game.id}, {players: game.players}, function(err) {
          if(err) console.error('DB error removing player', err);
        });
      }
    })
  }
}
