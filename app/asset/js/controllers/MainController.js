angular.module('truliavnApp').controller('LoginController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
	$scope.login = function(){
		$scope.error = false;
		$scope.disabled = true;

		//call login from service
		AuthService.login($scope.loginForm.username, $scope.loginForm.password)
			.then(function(){
				$location.path('/');
				$scope.token = AuthService.getUserToken();
				$scope.userEmail = AuthService.getUserStatus();
				console.log($scope.username);
				console.log($scope.token);
				$scope.disabled = false;
				$scope.loginForm = {};
			})
			.catch(function(){
				$scope.error = true;
				$scope.errorMessage = "Invalid username or password";
				$scope.disabled = false;
				$scope.loginForm = {};
			});
	};
}]);

angular.module('truliavnApp').controller('RegisterController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){

	$scope.register = function(){
		$scope.error = false;
		$scope.disabled = true;

		AuthService.register($scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.address, $scope.registerForm.phone, $scope.registerForm.fullName)
		//handle suscess
		.then(function(){
			$location.path('#!/login');
			$scope.disabled = false;
			$scope.registerForm ={};
		})
		.catch(function(){
			$scope.error = true;
			$scope.errorMessage = "Some thing went wrong";
			$scope.registerForm = {};
		});
	};
}]);

angular.module('truliavnApp').controller('LogoutControler', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
	$scope.logout = function(){
		AuthService.logout()
		.then(function(){
			$location.path('#!/');
		});
	};
}]);

angular.module('truliavnApp').controller('AddHouseCtrl', ['$scope', function($scope){
	
}])
angular.module('truliavnApp').controller('EditHouseCtrl', ['$scope', function($scope){
	
}])
angular.module('truliavnApp').controller('DeleteHouseCtrl', ['$scope', function($scope){
	
}])