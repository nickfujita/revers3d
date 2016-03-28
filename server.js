var express = require ('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var utils = require('./server/utils');

var gameDb = require('./db/gameModel').gameModel;
var Rooms = require('./server/Rooms');
var sockets = require('./server/socketHandler');

var PORT = process.env.PORT || 3030;

app.use('/', express.static('app'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.get('/join', function(req, res) {
  res.sendFile(__dirname + '/app/lobby/index.html');
});

// Create a new game room
app.get('/new', function(req, res) {
  var roomId = utils.randStr(4);
  var board = new gameDb({roomId: roomId, moves: [], private: false});
  board.save(function(err, board) {
    if(board) {
      // var gameState = new GameState();
      // sockets.createRoom('/game/' + board.roomId, io);
      res.redirect('/play/' + board.roomId);
    }
    else {
      console.error("Error creating new game. Please retry.", err);
      res.redirect('/');
    }
  });
});

app.get('/play/single', function(req, res) {
  res.sendFile(__dirname + '/app/play/single.html');
});

// Join an existing room by id
app.get('/play/:roomId', function(req, res) {
  var roomId = req.params.roomId;
  gameDb.findOne({roomId: roomId}, function(err, board) {
    if(board) {
      res.sendFile(__dirname + '/app/play/multi.html');
      sockets.connect(req.url, board.moves, io);
    } else {
      res.redirect('/');
    }
  });
});

server.listen(PORT, function() {
  console.log('app listening on port', PORT, 'at', new Date().toLocaleTimeString());
});
