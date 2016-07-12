app.controller('AddHouseCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', function($scope, AuthService, $http, HouseService, $location){
	// console.log(AuthService.getUserToken(), AuthService.getUserEmail());

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

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
	});
	var url2 = AuthService.hostName + '/api/wards';
	$http.get(url2).then(function success(response){
		$scope.wards = response.data.wards;
	});

	$scope.addHouse = function($routeParams){
		$scope.disabled = true;
		HouseService.addHouse(AuthService.getUserEmail(), AuthService.getUserToken(), $scope.addHouseForm.type,$scope.addHouseForm.title,  $scope.addHouseForm.address,  $scope.addHouseForm.area,  $scope.addHouseForm.houseFor,  $scope.addHouseForm.bedroom, $scope.addHouseForm.bathroom, $scope.addHouseForm.floor, $scope.addHouseForm.interior, $scope.addHouseForm.buildIn, $scope.addHouseForm.price, $scope.addHouseForm.feePeriod, $scope.addHouseForm.city, $scope.addHouseForm.district, $scope.addHouseForm.ward, $scope.addHouseForm.description, $routeParams)
		.then(function(){
			console.log("Thêm nhà thành công");
			$location.path('/houses');
		})
		.catch(function(){
			console.log("Thêm nhà không thành công");
		});
	}
}]);
app.controller('DeleteHouseCtrl', ['$scope', 'AuthService', '$routeParams', '$http', '$cookies', '$location' , function($scope, AuthService, $routeParams, $http, $cookies, $location){
	var email = $cookies.get('user.email');
	var token = $cookies.get('user.token');
	var houseId = $routeParams;
	$http.post(AuthService.hostName +'/api/house/delete', {email: email, token: token, houseId: houseId})
		.then(function(response){
			console.log("Xoa nha thanh cong");
			$location.path('#!/manage-post');
		}, function(){
			console.log('xóa nhà không thành công');
			$location.path('#!/manage-post');
		});
}]);

app.controller('HouseForRentCtrl', ['$scope', '$http', 'API', function($scope, $http, API){
	var rentUrl = API.getHousesForRent();
	
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

	$scope.filterHouse = function(){
			console.log($scope.search);
	};

	$http.get(rentUrl).then(function(response){
		$scope.houses = response.data.houses;
		$scope.noOfPages = $scope.houses.length;

		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});
}]);

app.controller('HouseForSellCtrl', ['$scope', '$http', 'API', function($scope, $http, API){
	var sellUrl  = API.getHousesForSell();
	//pagination for search result
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

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		// console.log($scope.houses);
		angular.forEach($scope.houses, function(val, key){
				// console.log(val.description);
			val.description = val.description.slice(0, 150) + '....';
			// console.log(val.description);
		});
	});
}]);
