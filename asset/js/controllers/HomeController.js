app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API','$cookies', function($scope, $rootScope, $http, API, $cookies){
	// console.log("Hehe");
	var urlHouses = API.getHouses() + '&count=2&userId=' + $cookies.get('user.id');
	var urlHouseHaiBaTrung = API.getHousesIn('district', 15)+'&userId=' + $cookies.get('user.id');
	var urlHouseBaDinh = API.getHousesIn('district', 11)+'&userId=' + $cookies.get('user.id');
	var urlHouseHoaiDuc  = API.getHousesIn('district', 8)+'&userId=' + $cookies.get('user.id');
	// var $scope = this;
	//get some new house
	$http.get(urlHouses).then(function success(response){
		$scope.allHouses = response.data.houses;
		angular.forEach($scope.allHouses, function(val){
			val.price = convertPrice(val.price);
		})
	}, function error(response){
		console.log(response);
	});
	$http.get(urlHouseHaiBaTrung).then(function success(response){
		$scope.HaiBaTrung = response.data.houses;
		// console.dir($scope.newPost[0]);
		angular.forEach($scope.HaiBaTrung, function(val){
			val.price = convertPrice(val.price);
		})
	}, function error(response){
		console.log(response);
	});

	$http.get(urlHouseHoaiDuc).then(function success(response){
		$scope.HoaiDuc = response.data.houses;
		angular.forEach($scope.HoaiDuc, function(val){
			val.price = convertPrice(val.price);
		})
		}, function error(response){
			console.log(response);
	});

	$http.get(urlHouseBaDinh).then(function success(response){
		$scope.BaDinh = response.data.houses;
		// console.dir($scope.newPost[0]);
		angular.forEach($scope.BaDinh, function(val){
			val.price = convertPrice(val.price);
		})
	}, function error(response){
		console.log(response);
	});

	 function convertPrice(price){
		price = price * 1000000;
		var s= '';
		do {
          	var n = price%1000;
          	var str = "";
          	var tmp =  n.toString();
          	price = Math.floor(price/1000);
          	if(price){
		    	str = '.' + (n ? (n < 10 ? ('00' + tmp) : (n < 100 ? ('0' + tmp) : tmp)) : '000');
          	}
          	else {
            	str = tmp; 
          	}

		  	s = str.concat(s);

		} while(price/1000>0);

		return s;
	}
}]);
