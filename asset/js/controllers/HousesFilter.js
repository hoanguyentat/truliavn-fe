app.controller('HousesFilterContentCtrl', ['$scope', '$http', 'AuthService', '$cookies','$location', function($scope, $http, AuthService, $cookies, $location ){
	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	});
	$scope.cityChange = function(){
		$http.get(AuthService.hostName + '/api/districts?city=' + $scope.citySelected).then(function success(response){
			$scope.districts = response.data.districts;
		});
	}
	$scope.search = function(){
		$cookies.remove('filter.houseFor');
		$cookies.remove('filter.city');
		$cookies.remove('filter.districtSelected');
		$cookies.remove('filter.area');
		$cookies.remove('filter.price');

		if ($scope.area == undefined ) {$scope.area = 0};
		if ($scope.price == undefined ) {$scope.price = 0};
		if ($scope.houseFor == undefined ) {$scope.houseFor = 0};
		if ($scope.city == undefined ) {$scope.city = 0};
		if ( $scope.districtSelected == undefined) {$scope.districtSelected=0};
		$cookies.put('filter.houseFor', $scope.houseFor);
		$cookies.put('filter.city', $scope.city);		
		$cookies.put('filter.districtSelected', $scope.districtSelected);
		$cookies.put('filter.area', $scope.area);
		$cookies.put('filter.price', $scope.price);
		// console.log($cookies.get('fitler.city'), $cookies.get('fitler.districtSelected'), $cookies.get('fitler.area'));
		$location.path('/filter/houses?' +$scope.houseFor+ $scope.city+$scope.districtSelected+$scope.area+$scope.price);
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
	var houseFor = $cookies.get('filter.houseFor');
	var city = $cookies.get('filter.city');
	var district = $cookies.get('filter.districtSelected');
	var area = $cookies.get('filter.area');
	var price = $cookies.get('filter.price');
	var url = AuthService.hostName + '/api/houses?district=' + district + '&city=' + city+ '&houseFor='+ houseFor + '&minArea=' + areaArr[area][0] + '&maxArea=' + areaArr[area][1] + '&minPrice=' + priceArr[price][0] + '&maxPrice='+ priceArr[price][1];
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
			console.log('Lỗi rỗi');
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
		// console.log($scope.attr, $scope.reserve);
	};
}]);