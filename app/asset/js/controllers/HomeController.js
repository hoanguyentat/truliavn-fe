app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API', function($scope, $rootScope, $http, API){
	// console.log("Hehe");
	var urlHouses = API.getHouses();
	var urlHouseCity = API.getHousesIn('district', 12)
	var list = this;
	//get some new house
	$http.get(urlHouses).then(function success(response){
		list.allHouses = response.data.houses;
		// console.dir(list.allHouses);
	}, function error(response){
		console.log(response);
	});
	$http.get(urlHouseCity).then(function success(response){
		list.cityHouses = response.data.houses;
		// console.dir(list.newPost[0]);
	}, function error(response){
		console.log(response);
	});
}]);
