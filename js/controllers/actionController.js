
var socket = io();

app.controller('actionController',
	function actionController ($scope) {

		$scope.turnOn = function () {
    console.log('on');
			socket.emit('turnOn');
		}
		$scope.turnOff = function () {
			socket.emit('turnOff');
		}

			socket.on('turnOn', function(){
				console.log('recived socket on')
			});
	});