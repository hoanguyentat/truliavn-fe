app.controller('AddHouseCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', function($scope, AuthService, $http, HouseService, $location){
	console.log(AuthService.getUserToken(), AuthService.getUserEmail());

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
		console.log($scope.districts);
	});
	var url2 = AuthService.hostName + '/api/wards';
	// console.log(url2);
	$http.get(url2).then(function success(response){
		$scope.wards = response.data.wards;
	});

	$scope.addHouse = function(){
		$scope.disabled = true;
		HouseService.addHouse(AuthService.getUserEmail(), AuthService.getUserToken(), $scope.addHouseForm.type,$scope.addHouseForm.title,  $scope.addHouseForm.address,  $scope.addHouseForm.area,  $scope.addHouseForm.houseFor,  $scope.addHouseForm.bedroom, $scope.addHouseForm.bathroom, $scope.addHouseForm.floor, $scope.addHouseForm.interior, $scope.addHouseForm.buildIn, $scope.addHouseForm.price, $scope.addHouseForm.feePeriod, $scope.addHouseForm.city, $scope.addHouseForm.district, $scope.addHouseForm.ward, $scope.addHouseForm.description)
		.then(function(){
			console.log("Them nha thành công");
			$location.path('/houses');
		})
		.catch(function(){
			console.log("Thêm nhà không thành công");
		});
	}
}]);

app.controller('EditHouseCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', '$routeParams', function($scope, AuthService, $http, HouseService, $location, $routeParams ){
	console.log(AuthService.getUserToken(), AuthService.getUserEmail());

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
		console.log($scope.districts);
	});
	var url2 = AuthService.hostName + '/api/wards';
	// console.log(url2);
	$http.get(url2).then(function success(response){
		$scope.wards = response.data.wards;
	});

	$scope.addHouse = function($routeParams){
		$scope.disabled = true;
		HouseService.addHouse(AuthService.getUserEmail(), AuthService.getUserToken(), $scope.addHouseForm.type,$scope.addHouseForm.title,  $scope.addHouseForm.address,  $scope.addHouseForm.area,  $scope.addHouseForm.houseFor,  $scope.addHouseForm.bedroom, $scope.addHouseForm.bathroom, $scope.addHouseForm.floor, $scope.addHouseForm.interior, $scope.addHouseForm.buildIn, $scope.addHouseForm.price, $scope.addHouseForm.feePeriod, $scope.addHouseForm.city, $scope.addHouseForm.district, $scope.addHouseForm.ward, $scope.addHouseForm.description, $routeParams)
		.then(function(){
			console.log("Them nha thành công");
			$location.path('/houses');
		})
		.catch(function(){
			console.log("Thêm nhà không thành công");
		});
	}
}]);
app.controller('DeleteHouseCtrl', ['$scope', 'AuthService', '$routeParams' , function($scope, AuthService, $routeParams){
	$scope.deletaHouse = function(){
		
	};
}]);

app.controller('HouseForRentCtrl', ['$scope', '$http', 'API', function($scope, $http, API){
	var rentUrl = API.getHousesForRent();
	console.log(rentUrl);
	var listRent = this;
	listRent.currentPage = 0;
	listRent.pageSize = 20;
	listRent.numberOfPages = function(){
		// console.log(listRent.houses.length);
		return Math.ceil(listRent.houses.length/listRent.pageSize);
	};
	$http.get(rentUrl).then(function(response){
		listRent.houses = response.data.houses;

		angular.forEach(listRent.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});
	console.log(listRent.currentPage, listRent.pageSize);
}]);

app.controller('HouseForSellCtrl', ['$scope', '$http', 'API', function($scope, $http, API){
	var sellUrl  = API.getHousesForSell();
	var listSell = this;
	listSell.currentPage = 0;
	listSell.pageSize = 20;
	listSell.numberOfPages = function(){
			return Math.ceil(listSell.houses.length/listSell.pageSize);
		};
	$http.get(sellUrl).then(function(response){
		listSell.houses = response.data.houses;
		console.log(listSell.houses);
		angular.forEach(listSell.houses, function(val, key){
				// console.log(val.description);
			val.description = val.description.slice(0, 150) + '....';
			// console.log(val.description);
		});
	});
}]);
