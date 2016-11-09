
var socket = io();

app.controller('actionController',
	function actionController ($scope) {

		$scope.checkboxModel = {
			value1 : false
		};

		$scope.turnOnOff = function (dato) {
    	console.log(dato);
			if(dato) {
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

		socket.on("lectura", function(lectura) {
			$scope.$apply(function(){
				if (lectura == "1"){
					$scope.checkboxModel.value1 = true;
					$scope.data = "Led is ON";
				}
				else if (lectura == "0") {
					$scope.checkboxModel.value1 = false;
					$scope.data = "Led is OFF";
				}
			});
		});
	});