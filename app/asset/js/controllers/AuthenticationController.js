app.controller('LoginController', ['$scope', '$location', 'AuthService', '$http', '$rootScope', function($scope, $location, AuthService, $http, $rootScope){
	$scope.login = function(){
		$scope.error = false;
		$scope.disabled = true;

		//call login from service
		AuthService.login($scope.loginForm.username, $scope.loginForm.password)
			.then(function(){
				$scope.token = AuthService.getUserToken();
				$scope.userEmail = AuthService.getUserEmail();
				
				
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
		$scope.userInfo = res.data.user;
		console.log(res.data.user);
	})
	$scope.update = function(){
		console.log('userid : ' + userID);
		AuthService.update( userID,
							$scope.updateForm.fullName, 
							$scope.updateForm.phone, 
							$scope.updateForm.address, 
							$scope.updateForm.oldpass,
							$scope.updateForm.newpass,
							$scope.updateForm.confirmpass)
		.then(function(){
			$location.path("#!/");
			$scope.updateForm = {};
			console.log("update success");
		})
		.catch(function(){
			$scope.error = true;
			$scope.errorMessage = "Bạn đã nhập sai mật khẩu. Yêu cầu nhập lại";
			$scope.updateForm = {};
			console.log("update fail");
		})
	}
}]);
app.controller('LogoutControler', ['$scope', '$location', 'AuthService', '$route', function($scope, $location, AuthService, $route){
	$scope.logout = function(){
		AuthService.logout()
		.then(function(){
			$location.path('/');
			$route.reload();	
		});
	};
}]);
