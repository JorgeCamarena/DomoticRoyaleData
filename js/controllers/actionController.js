
var socket = io();

app.controller('actionController',
	function actionController ($scope) {

		$scope.turnOn = function () {
    console.log('on');
			socket.emit('turnOn', "hi");
		}
		$scope.turnOff = function () {
			socket.emit('turnOff');
		}
	});