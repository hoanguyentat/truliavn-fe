app.controller('LoginController', ['$scope', '$location', 'AuthService', '$http', function($scope, $location, AuthService, $http){
	$scope.login = function(){
		$scope.error = false;
		$scope.disabled = true;
		
		//call login from service
		AuthService.login($scope.loginForm.username, $scope.loginForm.password)
			.then(function(){

				$scope.token = AuthService.getUserToken();
				$scope.userEmail = AuthService.getUserEmail();
				console.log($scope.userEmail);
				console.log($scope.token);
				$scope.disabled = false;
				$scope.loginForm = {};
				$location.path('/');
			})
			.catch(function(){
				$scope.error = true;
				$scope.errorMessage = "Invalid username or password";
				$scope.disabled = false;
				$scope.loginForm = {};
			});
	};
}]);

app.controller('RegisterController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){

	$scope.register = function(){
		$scope.error = false;
		$scope.disabled = true;

		AuthService.register($scope.registerForm.email, $scope.registerForm.password, $scope.registerForm.repass, $scope.registerForm.address, $scope.registerForm.phone, $scope.registerForm.fullName)
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

app.controller('LogoutControler', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
	$scope.logout = function(){
		AuthService.logout()
		.then(function(){
			$location.path('#!/');
		});
	};
}]);