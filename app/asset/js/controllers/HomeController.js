app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API', function($scope, $rootScope, $http, API){
	// console.log("Hehe");
	var urlHouses = API.getHouses();
	var urlHouseHaiBaTrung = API.getHousesIn('district', 11)
	var urlHouseBaDinh = API.getHousesIn('district', 11)
	// var $scope = this;
	//get some new house
	$http.get(urlHouses).then(function success(response){
		$scope.allHouses = response.data.houses;
		// console.dir($scope.allHouses);
	}, function error(response){
		console.log(response);
	});
	$http.get(urlHouseHaiBaTrung).then(function success(response){
		$scope.HaiBaTrung = response.data.houses;
		// console.dir($scope.newPost[0]);
	}, function error(response){
		console.log(response);
	});

	$http.get(urlHouseBaDinh).then(function success(response){
		$scope.BaDinh = response.data.houses;
		// console.dir($scope.newPost[0]);
	}, function error(response){
		console.log(response);
	});
}]);
