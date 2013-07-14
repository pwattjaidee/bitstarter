var express = require('express');
var fs = require('fs');
var buf = new Buffer(256);
var len;

fs.readFile('index.html', "utf-8", function (err, data) {
  if (err) throw err;
  console.log(data);
  buf = new Buffer(data.length);
  len = buf.write(data, "utf-8");
});


var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(buf.toString('utf-8', 0, len))
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});



