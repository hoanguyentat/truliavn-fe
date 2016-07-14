angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', 'AuthService', 'API', '$scope', function($http, AuthService, API, $scope){

		var url = API.getHouses();
		$scope.titlePage = "Thông tin nhà đất Việt Nam";
		$scope.currentPage = 1;
		$scope.pageSize = 20;
		$scope.maxSize = 5; //Number of pager buttons to show


		$http.get(url).then(function success(response){
			$scope.houses = response.data.houses;
			$scope.homes = $scope.houses;

			$scope.noOfPages = $scope.houses.length;
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		});
	}]
});	