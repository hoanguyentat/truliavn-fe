app.controller('SearchContent', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', function($scope, $http, AuthService, $rootScope, $location, $cookies){
	// var searchContent = $scope.SearchForm.searchContent;
	$scope.title = "Tìm kiếm nhà đất";
	$scope.search = function(){
		$cookies.remove('search.housefor');
		$cookies.put('search.housefor', $scope.SearchForm.houseFor);
		$location.path('/search/' + $scope.SearchForm.searchContent);
	};
}]);

app.controller('SearchController', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', '$sce','$routeParams', function($scope, $http, AuthService, $rootScope, $location, $cookies, $sce, $routeParams){
	// var list = this
	$scope.currentPage = 1;
	$scope.pageSize = 20;
	$scope.maxSize = 5
	$scope.searchContent = $routeParams.searchContent;
	$http.post(AuthService.hostName + '/api/search', {search: $routeParams.searchContent, housefor: $cookies.get('search.housefor')})
	.then(function(res){
		$scope.houses = res.data.houses;
		$scope.noOfPages = $scope.houses.length;
		$cookies.remove('search.housefor');
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
		// console.log(typeof($scope.selected));
		switch($scope.selected){
			case "0":
				$scope.attr = 'create_at';
				$scope.reserve = false;
				break;
			case "1":
				$scope.attr = 'price';
				$scope.reserve = false;
				break;
			case "2":
				$scope.attr = 'price';
				$scope.reserve = true;
				break;
			case "3":
				$scope.attr = 'area';
				$scope.reserve = false;
				break;
			case "4":
				$scope.attr = 'area';
				$scope.reserve = true;
				break;
			default:
				$scope.attr = 'create_at';
				$scope.reserve = false;
		}
		// console.log($scope.attr, $scope.reserve);
	};
}]);