var express = require('express');
var path  = require('path');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var request = require('request');

var roothPath = path.normalize(__dirname);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(roothPath));

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'this_is_my_key') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        var messageText = messageText.toUpperCase();

        switch (messageText) {

            case 'TURN THE LIGHT ON':
                serialPort.write("1");
                sendTextMessage(senderID, 'The light was turned on');
                break;
            case 'TURN THE LIGHT OFF':
                serialPort.write("0");
                sendTextMessage(senderID, 'The light was turned off');
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: "EAAC0EyscUK4BAI4p7xiZBqMiBMY0WrnICr8xibPbZCu3efZAeb8RARFDXZA3nZAYqJd8OSR2bK6QOfJspGG7kTTulXiBJYuZCCWWYJCfytYN00i0ZAPp57sGFycBAN7ZBtLCZBZA8bRvkHXoNAjZC5yavKf6DFMi0fNNeJWdaf7ZCPkWegZDZD" },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

io.on('connection', function(socket){
  console.log("NEW USER");

    socket.on('turnOn', function(){
        serialPort.write("1");
    });

    socket.on('turnOff', function(){
        serialPort.write("0");
    });
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

server.listen(8000, function(){
  console.log('Server is running');
})