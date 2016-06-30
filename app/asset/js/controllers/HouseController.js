app.controller('AddHouseCtrl', ['$scope', function($scope){
	
}])
app.controller('EditHouseCtrl', ['$scope', function($scope){
	
}])
app.controller('DeleteHouseCtrl', ['$scope', function($scope){
	
}]);

app.controller('HouseForRentCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService){
	var rentUrl = AuthService.hostName + '/api/houses?housefor=rent';
	console.log(rentUrl);
	var listRent = this;
	listRent.currentPage = 0;
	listRent.pageSize = 20;
	listRent.numberOfPages = function(){
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

app.controller('HouseForSellCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService){
	var sellUrl  = AuthService.hostName + '/api/houses?housefor=sell';
	var listSell = this;
	listSell.currentPage = 0;
	listSell.pageSize = 20;
	listSell.numberOfPages = function(){
			return Math.ceil(listSell.houses.length/listSell.pageSize); 
		};
	$http.get(sellUrl).then(function(response){
		listSell.houses = response.data.houses;
		// console.log(listSell.houses);
		angular.forEach(listSell.houses, function(val, key){
				// console.log(val.description);
			val.description = val.description.slice(0, 150) + '....';
			// console.log(val.description);
		});
	});
}]);