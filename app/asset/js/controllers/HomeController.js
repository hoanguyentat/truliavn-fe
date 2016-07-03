app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API', function($scope, $rootScope, $http, API){
	// console.log("Hehe");
	var url = API.getHouses();
	var list = this;
	//get some new house
	$http.get(url).then(function success(response){
		list.newPost = response.data.houses;
		// console.dir(list.newPost[0]);
	}, function error(response){
		console.log(response);
	});
}]);
