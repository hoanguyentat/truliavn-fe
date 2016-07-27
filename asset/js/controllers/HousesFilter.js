app.controller('HousesFilterContentCtrl', ['$scope', '$http', 'AuthService', '$cookies','$location', function($scope, $http, AuthService, $cookies, $location ){
	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	});
	$scope.cityChange = function(){
		$http.get(AuthService.hostName + '/api/districts?city=' + $scope.filter.citySelected).then(function success(response){
			$scope.districts = response.data.districts;
		});
	}

	$scope.advanceSearch = function() {
		$scope.advanceDisplay = !$scope.advanceDisplay;
		if (!$scope.advanceDisplay) {
			$("#advanceSearch").html("<strong>Tìm kiếm nâng cao</strong>");
		}
		else {
			$("#advanceSearch").html("<strong>Bỏ tìm kiếm nâng cao</strong>");
		}
	}
	$scope.search = function(){
		
		$cookies.remove('filter');

		if ($scope.filter.area == undefined ) {$scope.filter.area = 0};
		if ($scope.filter.price == undefined ) {$scope.filter.price = 0};
		if ($scope.filter.houseFor == undefined ) {$scope.filter.houseFor = 0};
		if ($scope.filter.city == undefined ) {$scope.filter.city = 0};
		if ( $scope.filter.districtSelected == undefined) {$scope.filter.districtSelected=0};
		if ($scope.filter.bedrooms == undefined ) {$scope.filter.bedrooms = 0};
		if ($scope.filter.bathrooms == undefined ) {$scope.filter.bathrooms = 0};
		if ($scope.filter.floors == undefined ) {$scope.filter.floors = 0};
		$cookies.putObject('filter', $scope.filter);
		$location.path('/filter/houses?' +$scope.filter.houseFor+ $scope.filter.city+$scope.filter.districtSelected+$scope.filter.area+$scope.filter.price);
	};
}]);

app.controller('FilterHousesCtrl', ['$scope', '$http', '$cookies','AuthService', '$route', function($scope, $http, $cookies, AuthService, $route){

	var areaArr = [
	  [0,0],
      [0, 30],
      [30, 50],
      [50, 80],
      [80, 100],
      [100, 150],
      [150, 200],
      [200, 250],
      [250, 300],
      [300, 500],
      [500, 10000]
   ];
   var priceArr = [
	  [0,0],
      [0, 1], 
      [1, 3], 
      [3, 5],
      [5, 10],
      [10, 40],
      [40, 70],
      [70, 100],
      [100, 10000]
   ];
	var filter = $cookies.getObject('filter');
	console.log(filter);
	var url = AuthService.hostName + '/api/houses?district=' + filter.districtSelected + '&city=' + filter.citySelected+ '&houseFor='+ filter.houseFor + '&minArea=' + areaArr[filter.area][0] + '&maxArea=' + areaArr[filter.area][1] + '&minPrice=' + priceArr[filter.price][0] + '&maxPrice='+ priceArr[filter.price][1] + '&bedrooms=' + filter.bedrooms + '&bathrooms=' + filter.bathrooms + '&floors=' + filter.floors;
	console.log(url);
	$scope.currentPage = 1;
	$scope.pageSize = 20;
	$scope.maxSize = 5;

	$http.get(url).then(function(res){
		$scope.houses = res.data.houses;
		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		// $route.reload();
		}, function(){
			console.log('Lỗi');
		}
	);
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
	};
}]);