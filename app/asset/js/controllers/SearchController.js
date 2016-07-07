app.controller('SearchController', ['$scope', '$http', 'AuthService', '$rootScope', '$location', '$cookies', function($scope, $http, AuthService, $rootScope, $location, $cookies){
	// var searchContent = $scope.SearchForm.searchContent;
	$scope.search = function(){
		$cookies.remove('search.content');
		$cookies.remove('search.housefor');
		$cookies.put('search.content', $scope.SearchForm.searchContent);
		$cookies.put('search.housefor', $scope.SearchForm.houseFor);
		$location.path('/search/' + $scope.SearchForm.searchContent);
	};

	// console.log("hehe");
	var list = this
	list.currentPage = 0;
	list.pageSize = 20;
	$http.post(AuthService.hostName + '/api/search', {search: $cookies.get('search.content'), housefor: $cookies.get('search.housefor')})
	.then(function(res){
		list.houses = res.data.houses;
		console.log(res);
		list.numberOfPages = function(){
			return Math.ceil(list.houses.length/list.pageSize); 
		};
		angular.forEach(list.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
		$cookies.remove('search.content');
		$cookies.remove('search.housefor');
	});

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
			$rootScope.districts = response.data.districts;
		});
	var url2 = AuthService.hostName + '/api/wards';
	// console.log(url2);
	$http.get(url2).then(function success(response){
		$rootScope.wards = response.data.wards;
	});
}]);