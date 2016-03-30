/*
========================================
    Imports
========================================
 */

var express = require ('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var gameDb = require('./db/gameModel').gameModel;
var sockets = require('./server/socketHandler');

var utils = require('./server/utils');

/*
========================================
    Routing
========================================
 */

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

  var game = new gameDb({roomId: roomId, moves: [], private: false});

  game.save(function(err, game) {
    if(game) {
      sockets.createGame(game.roomId, io);
      res.redirect('/play/' + game.roomId);
    } else {
      console.error("Error creating new game.", err);
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
    } else {
      res.redirect('/');
    }
  });
});

/*
========================================
    Server initialization
========================================
 */

var PORT = process.env.PORT || 3030;

server.listen(PORT, function() {
  console.log('app listening on port', PORT, 'at', new Date().toLocaleTimeString());
});
