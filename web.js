var express = require('express');

var buf = new Buffer(256);
app.get('/', function(request, response) {
  var fs = require('fs');
  fs .readFile('./index.html', function (err, data){
  if (err) throw err;
  buf.write(data);
  }


var app = express.createServer(express.logger());
  response.send(buf.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
