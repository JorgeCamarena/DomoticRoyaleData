var express = require('express');
var path  = require('path');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var roothPath = path.normalize(__dirname);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(roothPath));


io.on('connection', function(socket){
  console.log("NEW USER");
});


var SerialPort = require('serialport');
var serialPort = new SerialPort('COM4', 
    {   baudrate: 9600
    });
 
serialPort.on("open", function () {
    console.log('open');

    setTimeout(function(){
      serialPort.write("H");

      setTimeout(function(){
        serialPort.write("L");
      }, 8000);

    },1000); 

});

serialPort.on("data", function(data) {
  var dato = data.toString();
  io.sockets.emit("lectura", dato);
});



server.listen(8000, function(){
  console.log('Server is running');
})