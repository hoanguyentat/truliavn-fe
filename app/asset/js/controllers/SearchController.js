app.controller('SearchContent', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', function($scope, $http, AuthService, $rootScope, $location, $cookies){
	// var searchContent = $scope.SearchForm.searchContent;
	$scope.title = "Tìm kiếm nhà đất";
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
		console.log(res.data.houses);
		$scope.noOfPost = $scope.houses.length;
		console.log("Do dai quang: " + $scope.noOfPost);
		$scope.numberOfPages = function(){
			return Math.ceil($scope.houses.length/$scope.pageSize); 
		};
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
		$cookies.remove('search.content');
		$cookies.remove('search.housefor');
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