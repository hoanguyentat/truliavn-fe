app.controller('UserInfoCtrl', ['$scope', '$http', '$cookies','API','$routeParams', function ($scope, $http, $cookies, API, $routeParams) {
	var userId = $cookies.get('user.id');
	$http.get(API.getUserInfo(userId))
	.then(function (res){
		if (res.data.user.username !== $routeParams.users) {
			$scope.check = false;
		}
		else{
			$scope.check = true;
			$scope.userInfo = res.data.user;
		}
	});
}]);
