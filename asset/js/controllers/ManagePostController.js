app.controller('ManagePostCtrl', ['$scope', 'API', '$cookies', '$http','HouseService','$location','$uibModal', function($scope, API, $cookies, $http, HouseService, $location, $uibModal){
	var urlPost = API.getUserPost($cookies.get('user.id'));
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	$http.get(urlPost).then(function(res){
		$scope.houses = res.data.houses;
		$scope.noOfPost = $scope.houses.length;
		$scope.numberOfPages = function(){
			return Math.ceil($scope.houses.length/$scope.pageSize); 
		};
	});

	$scope.deleteHouse = function(id){
		HouseService.deleteHouse($cookies.get('user.email'), $cookies.get('user.token'), id)
		.then(function(){
			$location.path('/manage-post');
		}, function(){
			$location.path('/manage-post');
		});
	};

	  $scope.animationsEnabled = true;

	  $scope.open = function() {

	    var modalInstance = $uibModal.open({
	      	animation: $scope.animationsEnabled,
	      	templateUrl: 'myModalContent.html',
	      	controller: 'ManagePostCtrl'
	    });
	};

  	$scope.cancel = function () {
    	 $uibModal.dismiss('cancel');
 	};
}]);