	

	var socket = io();

	app.controller('messageController', ['$scope', function($scope){
			
	socket.on("lectura", function(lectura) {
			console.log(lectura);
			$scope.$apply(function(){
				$scope.data = lectura;
			});
		});
		}]);