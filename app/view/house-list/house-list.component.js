angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', 'AuthService', 'API', '$scope', '$filter', function($http, AuthService, API, $scope, $filter){

		var url = API.getHouses();
		// $scope.noOfPages = 10;
		$scope.currentPage = 0;
		$scope.pageSize = 20;
		$scope.maxSize = 5; //Number of pager buttons to show


		$http.get(url).then(function success(response){
			$scope.houses = response.data.houses;
			console.log(response.data.houses);
			$scope.homes = $scope.houses;

			$scope.noOfPages = $scope.houses.length;
			console.log("So trang: " + $scope.noOfPages);
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		});
		$scope.filterDistrictHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected);

	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};

		$scope.filterWardHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected, $scope.wardSelected);

	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};
		$scope.filterAreaHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected, $scope.wardSelected, $scope.area, $scope.price);
	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};
		$scope.filterPriceHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected, $scope.wardSelected, $scope.area, $scope.price);
	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};

		$http.get(AuthService.hostName + '/api/districts').then(function success(response){
			$scope.districts = response.data.districts;
		});
		var url2 = AuthService.hostName + '/api/wards';
		$http.get(url2).then(function success(response){
			$scope.wards = response.data.wards;
		});
	}]
});	