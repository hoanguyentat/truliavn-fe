app.controller('UserInfoCtrl', ['$scope', '$http', '$cookies','API', function ($scope, $http, $cookies, API) {
	var userId = $cookies.get('user.id');
	$http.get(API.getUserInfo(userId))
	.then(function (res){
		$scope.userInfo = res.data.user;
		console.log(res);
		$scope.userInfo = res.data.user;
	});
}]);
