app.controller('LoginController', ['$scope', '$location', 'AuthService', '$http', '$rootScope', function($scope, $location, AuthService, $http, $rootScope){
	if (AuthService.isLoggedIn()) {
		$location.path('/');
	}
	$scope.login = function(){
		$scope.error = false;
		$scope.disabled = true;

		//call login from service
		AuthService.login($scope.loginForm)
			.then(function(){
				$scope.token = AuthService.getUserToken();
				$scope.userEmail = AuthService.getUserEmail();
				
				
				$scope.disabled = false;
				$scope.loginForm = {};
				$location.path('/');
			})
			.catch(function(){
				$scope.error = true;
				$scope.errorMessage = "Sai tài khoản hoặc mật khẩu";
				$scope.disabled = false;
				$scope.loginForm = {};
			});
	};
}]);


app.controller('RegisterController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){

		$scope.register = function(){

		$scope.error = false;
		$scope.disabled = true;
		// $scope.registerForm.birthday = getFullYear($scope.registerForm.birthday);

		AuthService.register($scope.registerForm)
		//handle suscess
		.then(function(){
			$location.path('#!/login');
			$scope.disabled = false;
			$scope.registerForm ={};
		})
		// catch error when user register not success
		.catch(function(){
			$scope.error = true;
			$scope.errorMessage = "Đã có lỗi xảy ra";
			$scope.registerForm = {};
		});
	};
}]);


app.controller('UpdateController', ['$scope', '$location', '$http','$cookies', 'AuthService', 'API', function($scope, $location,$http, $cookies, AuthService, API){
	var userID = $cookies.get('user.id');
	$http.get(API.getUserInfo(userID))
	.then(function (res){
		$scope.updateForm = res.data.user;
		$scope.updateForm.userId = $scope.updateForm.id;
		delete($scope.updateForm.id);
	})
	$scope.update = function(){
		AuthService.update($scope.updateForm)
		.then(function(){
			$location.path("/");
			$scope.updateForm = {};
		})
		.catch(function(){
			$scope.error = true;
			$scope.errorMessage = "Bạn đã nhập sai mật khẩu. Yêu cầu nhập lại";
			$scope.updateForm = {};
		})
	}
}]);
app.controller('LogoutControler', ['$scope', '$location', 'AuthService', '$route','$cookies', function($scope, $location, AuthService, $route, $cookies){
	$scope.userId = $cookies.get('user.id');
	$scope.logout = function(){
		AuthService.logout()
		.then(function(){
			$location.path('/');
			$route.reload();
		});
	};
}]);
