app.controller('myCtrl', ['$scope', '$http', function($scope, $http){
	var url = 'http://localhost:3000/api/house/24?raw=1';
	$http.get(url).then(function success(response){
		console.log(response);
		$scope.house = response.data.houses;
		console.log($scope.house);
	},
	function error(response){
		// $scope.error = response.status;
	});
}]);