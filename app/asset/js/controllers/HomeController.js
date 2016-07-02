app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API', function($scope, $rootScope, $http, API){
	// console.log("Hehe");
	var url = API.getHouses();
	var house = this;
	$http.get(url).then(function success(response){
		house.newPost = response.data.houses;
		console.log(response.data);
	}, function error(response){
		console.log(response);
	});
}]);