app.controller('AddHouseCtrl', ['$scope', function($scope){
	
}])
app.controller('EditHouseCtrl', ['$scope', function($scope){
	
}])
app.controller('DeleteHouseCtrl', ['$scope', function($scope){
	
}]);

app.controller('HouseForRentCtrl', ['$scope', '$http', function($scope, $http){
	var rentUrl = 'http://localhost:3000/api/houses?housefor=rent';
	var listRent = this;
	listRent.currentPage = 0;
	listRent.pageSize = 20;
	listRent.numberOfPages = function(){
			return Math.ceil(listRent.houses.length/listRent.pageSize); 
		};
	$http.get(rentUrl).then(function(response){
		listRent.houses = response.data.houses;
		console.log(listRent.houses);
	});
	console.log(listRent.currentPage, listRent.pageSize);
}]);

app.controller('HouseForSellCtrl', ['$scope', '$http', function($scope, $http){
	var sellUrl  = 'http://localhost:3000/api/houses?housefor=sell';
	var listSell = this;
	$http.get(sellUrl).then(function(response){
		listSell.houses = response.data.houses;
		console.log(listSell.houses);
	});
}]);