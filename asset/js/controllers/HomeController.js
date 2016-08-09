app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API','$cookies', function($scope, $rootScope, $http, API, $cookies){
	// console.log("Hehe");
	var urlHouses = API.getHouses() + '&userId=' + $cookies.get('user.id');
	var urlHouseHaiBaTrung = API.getHousesIn('district', 15)+'&userId=' + $cookies.get('user.id');
	var urlHouseBaDinh = API.getHousesIn('district', 11)+'&userId=' + $cookies.get('user.id');
	var urlHouseHoaiDuc  = API.getHousesIn('district', 8)+'&userId=' + $cookies.get('user.id');
	// var $scope = this;
	//get some new house
	$http.get(urlHouses).then(function success(response){
		$scope.allHouses = response.data.houses;
	}, function error(response){
		console.log(response);
	});
	$http.get(urlHouseHaiBaTrung).then(function success(response){
		$scope.HaiBaTrung = response.data.houses;
		// console.dir($scope.newPost[0]);
	}, function error(response){
		console.log(response);
	});

	$http.get(urlHouseHoaiDuc).then(function success(response){
		$scope.HoaiDuc = response.data.houses;
		console.dir($scope.HoaiDuc);
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
