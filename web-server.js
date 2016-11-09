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
//var serialPort = new SerialPort('COM4', 
var serialPort = new SerialPort('/dev/cu.usbmodem1421', 
    {   baudrate: 9600
    });
 
serialPort.on("open", function () {
    console.log('open');

    setTimeout(function(){
        console.log('HIGH');

        serialPort.write("H");

      setTimeout(function(){
        serialPort.write("L");
      }, 1000);

    },1000); 

});

serialPort.on("data", function(data) {
  var dato = data.toString();
    console.log('data received');

    io.sockets.emit("lectura", dato);
});

io.on('turnOn', function(){
    console.log('recived socket on')
  serialPort.write("1");
});

io.on('turnOff', function(){
  serialPort.write("0");
});

server.listen(8000, function(){
  console.log('Server is running');
})