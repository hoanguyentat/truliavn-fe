app.controller('SearchContent', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', function($scope, $http, AuthService, $rootScope, $location, $cookies){
	// var searchContent = $scope.SearchForm.searchContent;
	$scope.search = function(){
		$cookies.remove('search.content');
		$cookies.remove('search.housefor');
		$cookies.put('search.content', $scope.SearchForm.searchContent);
		$cookies.put('search.housefor', $scope.SearchForm.houseFor);
		$location.path('/search/' + $scope.SearchForm.searchContent);
	};
}]);

app.controller('SearchController', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', function($scope, $http, AuthService, $rootScope, $location, $cookies){
	// var list = this
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	$http.post(AuthService.hostName + '/api/search', {search: $cookies.get('search.content'), housefor: $cookies.get('search.housefor')})
	.then(function(res){
		$scope.houses = res.data.houses;
		// console.log(res);
		$scope.numberOfPages = function(){
			return Math.ceil($scope.houses.length/$scope.pageSize); 
		};
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
		$cookies.remove('search.content');
		$cookies.remove('search.housefor');
	});
}]);