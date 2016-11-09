
var socket = io();

app.controller('actionController',
	function actionController ($scope) {

		$scope.checkboxModel = {
			value1 : true
		};

		$scope.turnOnOff = function () {
    	console.log(checkboxModel.value1);
			if(checkboxModel.value1) {
				socket.emit('turnOn');
			}else {
				socket.emit('turnOff')
			}
		}


		$scope.turnOff = function () {
			socket.emit('turnOff');
		}

			socket.on('turnOn', function(){
				console.log('recived socket on')
			});
	});