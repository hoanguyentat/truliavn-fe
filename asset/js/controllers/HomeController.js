app.controller('HomeController', ['$scope', '$rootScope', '$http', 'API','$cookies', function($scope, $rootScope, $http, API, $cookies){
	// console.log("Hehe");
	var urlHouses = API.getHouses() + '&count=2&userId=' + $cookies.get('user.id');
	
	var urlHouseDongDa  = API.getHousesIn('district', 8)+'&count=8' +'&userId=' + $cookies.get('user.id');
	var urlHouseHaiBaTrung = API.getHousesIn('district', 11)+'&count=4' +'&userId=' + $cookies.get('user.id');
	var  urlHouseLongBien = API.getHousesIn('district', 15)+ '&count=6' +'&userId=' + $cookies.get('user.id');
	// console.log(urlHouseHaiBaTrung);
	// var $scope = this;
	function splitAddress(add){
		add = add.split(',');
		return add[0];
	}
	//get some new house
	$http.get(urlHouses).then(function success(response){
		$scope.allHouses = response.data.houses;
		angular.forEach($scope.allHouses, function(val){
			val.price = convertPrice(val.price);
			val.address = splitAddress(val.formatted_address);
		})
	}, function error(response){
		console.log(response);
	});
	$http.get(urlHouseHaiBaTrung).then(function success(response){
		var HBT = response.data.houses;
		
		angular.forEach(HBT, function(val){
			val.price = convertPrice(val.price);
			val.address = splitAddress(val.formatted_address);
		});
		$scope.HaiBaTrung = HBT;
	}, function error(response){
		console.log(response);
	});

	$http.get(urlHouseDongDa).then(function success(response){
		var DD = response.data.houses;
		angular.forEach(DD, function(val){
			val.price = convertPrice(val.price);
			val.address = splitAddress(val.formatted_address);
		});
		$scope.DongDa = DD;

		}, function error(response){
			console.log(response);
	});

	$http.get(urlHouseLongBien).then(function success(response){
		$scope.LongBien = response.data.houses;
		// console.dir($scope.newPost[0]);
		angular.forEach($scope.LongBien, function(val){
			val.price = convertPrice(val.price);
			val.address = splitAddress(val.formatted_address);
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
