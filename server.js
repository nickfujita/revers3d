var express = require ('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var PORT = process.env.PORT || 3030;

app.use(express.static('app'));

io.on('connection', function(socket){
  console.log('client connected');
});

server.listen(PORT, function() {
  console.log('app listening on port', PORT, 'at', new Date().toLocaleTimeString());
});
