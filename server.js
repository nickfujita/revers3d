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

  var game = new gameDb({roomId: roomId, moves: [], private: false, players: []});

  game.save(function(err, game) {
    if(game) {
      sockets.createGame(game.roomId, io);
      res.redirect('/game/' + game.roomId);
    } else {
      console.error("Error creating new game.", err);
      res.redirect('/');
    }
  });
});

app.get('/game/single', function(req, res) {
  res.sendFile(__dirname + '/app/game/single.html');
});

// Join an existing room by id
app.get('/game/:roomId', function(req, res) {
  var roomId = req.params.roomId;

  gameDb.findOne({roomId: roomId}, function(err, board) {
    if(board) {
      res.sendFile(__dirname + '/app/game/multi.html');
    } else {
      res.redirect('/');
    }
  });
});

// Join a game in progress or create one
app.get('/play', function(req, res) {
  gameDb.find({players: {$size: 1}, private: false}, function(err, docs) {
    if(err) {
      console.error('DB error finding game to join.', err);
      redirect('/');
    }

    if(docs.length) {
      var randGame = docs[Math.floor(Math.random() * docs.length)];
      res.redirect('/game/' + randGame.roomId);
    } else {
      redirect('/new');
    }
  });
});

// Find an existing game to watch
app.get('/watch', function(req, res) {
  gameDb.find({players: {$size: 2}, private: false}, function(err, docs) {
    if(err) {
      console.error('DB error finding game to watch.', err);
      redirect('/');
    }

    if(docs.length) {
      var randGame = docs[Math.floor(Math.random() * docs.length)];
      res.redirect('/game/' + randGame.roomId);
    } else {
      redirect('/');
    }
  })
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
