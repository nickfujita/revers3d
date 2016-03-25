var express = require ('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Game = require('./db/gameModel').gameModel;
var openSocketConnection = require('./server/socketHandler');
var helpers = require('./server/helpers');

var PORT = process.env.PORT || 3030;

app.use('/', express.static('app'));

// io.on('connection', function(socket){
//   console.log('client connected');
// });

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

// Create a new game room
app.get('/new', function(req, res) {
  var roomId = helpers.randStr(4);
  var board = new Game({roomId: roomId, moves: [], private:false});
  var id = board.roomId.toString();
  board.save(function(err, board) {
    if (err) { console.error(err); }
    else {
      console.log('created game @', id);
    }
  });
  // Redirect to the new board.
  res.redirect('/game/' + id);
});

// Join an existing room by id
app.get('/game/:roomId', function(req, res) {
  var roomId = req.params.roomId;
  Game.findOne({roomId: roomId}, function(err, board) {
    // If the game doesn't exist, or the route is invalid,
    // then redirect to the home page.
    if (board) {
      console.log('joined game @', roomId);
      // Invoke [request handler](../documentation/sockets.html) for a new socket connection
      // with board id as the Socket.io namespace.
      openSocketConnection(req.url, board, io);
      // Send back whiteboard html template.
      res.sendFile(__dirname + '/app/game/index.html');
      // res.end();
    } else {
      res.redirect('/');
    }
  });
});

server.listen(PORT, function() {
  console.log('app listening on port', PORT, 'at', new Date().toLocaleTimeString());
});
