app.controller('HousesFilterCtrl', ['$scope', '$http', 'AuthService', '$cookies','$location', function($scope, $http, AuthService, $cookies, $location ){
	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
			$scope.districts = response.data.districts;
			// console.log($rootScope.districts);
		});

	$scope.search = function(){
		$cookies.remove('fitler.houseFor');
		$cookies.remove('fitler.city');
		$cookies.remove('fitler.districtSelected');
		$cookies.remove('fitler.area');
		$cookies.remove('fitler.price');
		console.log($scope.houseFor, $scope.city, $scope.districtSelected, $scope.area, $scope.price);
		$cookies.put('filter.houseFor', $scope.houseFor);
		$cookies.put('fitler.city', $scope.city);
		$cookies.put('filter.districtSelected', $scope.districtSelected);
		$cookies.put('filter.area', $scope.area);
		$cookies.put('filter.price', $scope.price);
		$location.path('/houses-in-' + $scope.districtSelected);
	};
}]);