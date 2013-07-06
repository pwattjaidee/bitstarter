var express = require('express');
var buf = new Buffer(256);
var fs = equire('fs');

fs .readFile('./index.html', function (err, data){
  if (err) throw err;
  buf.write(data);
  console.log(data);
}

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World3!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
