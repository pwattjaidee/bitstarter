var express = require('express');

var app = express.createServer(express.logger());
var text;
app.get('/', function(request, response) {
  var fs = require('fs');
  fs .readFile('/index.html', function (err, data){
  if (err) throw err;
  text = data;
  }
  response.send(text);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
