angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', 'AuthService', 'API', '$scope', '$filter', function($http, AuthService, API, $scope, $filter){

		var url = API.getHouses();
		$scope.noOfPages = 10;
		$scope.search = "";
		$scope.currentPage = 0;
		$scope.pageSize = 20;
		$scope.maxSize = 5; //Number of pager buttons to show

		$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.setItemsPerPage = function(num) {
		  $scope.pageSize = num;
		  $scope.currentPage = 1; //reset to first page
		}

		$http.get(url).then(function success(response){
			$scope.houses = response.data.houses;
			$scope.homes = $scope.houses;
			console.log("--------Houses-------");
			console.log(typeof($scope.houses));
			console.log("--------Houses-------");
			$scope.noOfPages = $scope.houses.length;
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		});
		$scope.filterDistrictHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected);
			console.log("-------house-----------");
			console.dir(typeof($scope.houses));
			console.log("-------house-----------");

	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};

		$scope.filterWardHouse = function(){
			$scope.houses = $filter('houseDistrict')($scope.homes, $scope.districtSelected, $scope.wardSelected);
			console.log("-------house-----------");
			console.dir(typeof($scope.houses));
			console.log("-------house-----------");

	        $scope.noOfPages = $scope.houses.length;
	        // console.log(_.size($scope.houses));
			
			angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		};
		// console.log(house2);
		// $scope.$watch("search", function(val){ 
	 //    	console.log(val +" than thanh");
	 //        $scope.houses = $filter('houseDistrict')($scope.homes, val);
	 //        console.log('-----------------Log');
	 //        console.log($scope.homes);
	 //        console.log('-----------------Log');
	 //        $scope.noOfPages = $scope.houses.length;
		// 	console.log($scope.noOfPages);
		// 	angular.forEach($scope.houses, function(val, key){
		// 		val.description = val.description.slice(0, 150) + '....';
		// 	});
		// });
		$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
		// console.log($rootScope.districts);
			});
		var url2 = AuthService.hostName + '/api/wards';
		// console.log(url2);
		$http.get(url2).then(function success(response){
			$scope.wards = response.data.wards;
		});
	}]
});	