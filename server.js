var express = require ('express');
var app = express();

var port = process.env.PORT || 3030;

app.use(express.static('app'))

app.listen(port, function() {
  console.log('app listening on port', port, 'at', new Date().toLocaleTimeString());
})
