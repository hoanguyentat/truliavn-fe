app.controller('LikeCtrl', ['$scope', 'AuthService','$http','$location', 'API', '$cookies','$route', function ($scope, AuthService, $http, $location, API, $cookies, $route) {

	$scope.likeForm = {};
	$scope.likeClick = function(event, id, status){
		event.preventDefault();
		$scope.likeStatus = !status;
		// console.log(id);	
		$scope.likeForm.houseId = id;
		// console.log(id);
		$scope.likeForm.token = AuthService.getUserToken();
		$scope.likeForm.email = AuthService.getUserEmail();
		if ($scope.likeStatus) {
			$scope.likeForm.action = "like";
		}
		else{
			$scope.likeForm.action = "dislike";
		}
		// console.log($scope.likeForm);
		$http.post(AuthService.hostName + '/api/like', $scope.likeForm).then(function(res){
			// console.log("thanh cong");
			$route.reload();
		}, function(res){
			console.log(res);
			$location.path("/login");
		});
	};

}])