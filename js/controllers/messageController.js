	

	var socket = io();

	app.controller('messageController', ['$scope', function($scope){
			
	socket.on("lectura", function(lectura) {
			console.log(lectura);
			$scope.$apply(function(){
				if (lectura == "1"){
					$scope.data = "Led is ON";
				}
				else if (lectura == "0")
					$scope.data = "Led is OFF";
			});
		});
		}]);