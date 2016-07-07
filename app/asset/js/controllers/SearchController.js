app.controller('SearchController', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService){

	$scope.search = function(){
		$http.post('http://ngocdon.me:3000/api/search', {search: $scope.SearchForm.searchContent, housefor: $scope.SearchForm.houseFor})
		.then(function(res){
			console.log(res);
		});
	};

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
			$scope.districts = response.data.districts;
		});
	var url2 = AuthService.hostName + '/api/wards';
	// console.log(url2);
	$http.get(url2).then(function success(response){
		$scope.wards = response.data.wards;
	});
}]);