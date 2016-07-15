app.controller('AddHouseCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', function($scope, AuthService, $http, HouseService, $location){
	$scope.addHouseForm = {};
	$scope.addHouseForm.email =  AuthService.getUserEmail();
	$scope.addHouseForm.token =  AuthService.getUserToken();
	console.log($scope.addHouseForm.token);

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		console.log(response)
		$scope.cities = response.data.cities;
	});

	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
	});

	$http.get(AuthService.hostName + '/api/wards').then(function success(response){
		$scope.wards = response.data.wards;
	});
	$scope.addHouse = function(){
		console.log($scope.addHouseForm);
		var fd = new FormData(document.getElementById('form-add'));
		console.log(fd);
		// HouseService.addHouse(fd);
		$.ajax({
			url: AuthService.hostName + '/api/house',
			method: 'POST',
			contentType: false,
			processData: false,
			data: fd,
			success: function (data) {
				// console.log(data);
				window.location.href = "http://localhost:8080/#!/manage-post";
				$location.path('/manage-post');
			},
			error: function (err) {
				console.log(err);
			}
		});
	}
}]);

app.controller('EditHouseCtrl', ['$scope', 'AuthService', '$http', 'HouseService', '$location', '$routeParams', 'API', function($scope, AuthService, $http, HouseService, $location, $routeParams, API){
	// $scope.addHouseForm = {};
	
	//return old infomation of house
	var url = API.getHouseInfo($routeParams.postId);
	console.log(url);
	$http.get(url).then(function(res){
		$scope.addHouseForm = res.data.houses[0];
		$scope.addHouseForm.email =  AuthService.getUserEmail();
		$scope.addHouseForm.token =  AuthService.getUserToken();
		$scope.addHouseForm.houseId = $routeParams.postId;
		console.log($scope.addHouseForm);
	}, function(res){
		console.log("Lay du lieu khong thanh cong");
	})

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	});
	//get infomation about district, ward
	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
		$scope.districts = response.data.districts;
	});
	var url2 = AuthService.hostName + '/api/wards';
	$http.get(url2).then(function success(response){
		$scope.wards = response.data.wards;
	});
	//sent request to server
	$scope.editHouse = function(){
		console.log($scope.addHouseForm);
		$scope.disabled = true;
		var fd = new FormData(document.getElementById('form-edit'));
		$.ajax({
			url: AuthService.hostName + '/api/house/edit',
			method: 'POST',
			contentType: false,
			processData: false,
			data: fd,
			success: function (data) {
				// console.log(data);
				window.location.href = "http://localhost:8080/#!/manage-post";
			},
			error: function (err) {
				console.log(err);
			}
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
	
	$scope.currentPage = 1;
	$scope.pageSize = 20;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà đất cho thuê tại Việt Nam";

	$http.get(rentUrl).then(function(response){
		$scope.houses = response.data.houses;
		$scope.noOfPages = $scope.houses.length;

		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
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

app.controller('HouseForSellCtrl', ['$scope', '$http', 'API', function($scope, $http, API){
	var sellUrl  = API.getHousesForSell();
	//pagination for search result
	$scope.currentPage = 1;
	$scope.pageSize = 20;
	$scope.maxSize = 5; //Number of pager buttons to show
	$scope.titlePage = "Nhà đất bán tại Việt Nam";

	$http.get(sellUrl).then(function(response){
		$scope.houses = response.data.houses;

		$scope.noOfPages = $scope.houses.length;
		angular.forEach($scope.houses, function(val, key){
			val.description = val.description.slice(0, 150) + '....';
		});
	});

	$scope.sortHouses = function(){
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
