var SerialPort = require('serialport');
var serialPort = new SerialPort('COM4', 
    {   baudrate: 9600
    });
 
// serialPort.on("open", function () {
//     console.log('open');

//     setTimeout(function(){
//       serialPort.write("H");

//       setTimeout(function(){
//         serialPort.write("L");
//       }, 3000);

//     },1000); 

// });




$("#ON").click(function(){
	alert();

	serialPort.on("open", function () {
    	console.log('open');
    	serialPort.write("H");
    });

});

$("#OFF").click(function(){
	serialPort.on("open", function () {
    	console.log('open');
    	serialPort.write("L");
    });
});