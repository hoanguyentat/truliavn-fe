angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', 'AuthService', 'API', '$scope', function($http, AuthService, API, $scope){

		var url = API.getHouses();
		$scope.titlePage = "Thông tin nhà đất Việt Nam";
		$scope.currentPage = 1;
		$scope.pageSize = 20;
		$scope.maxSize = 5; //Number of pager buttons to show

		//sort the house by the price, area, time;
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
				case "5":
					$scope.attr = 'view',
					$scope.reserve = 'true';
				default:
					$scope.attr = 'create_at';
					$scope.reserve = false;
			}
			// console.log($scope.attr, $scope.reserve);
		};

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