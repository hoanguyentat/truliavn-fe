app.controller('HousesFilterCtrl', ['$rootScope', '$http', 'AuthService', function($rootScope, $http, AuthService){
	$http.get(AuthService.hostName + '/api/districts').then(function success(response){
			$rootScope.districts = response.data.districts;
			// console.log($rootScope.districts);
		});
	var url2 = AuthService.hostName + '/api/wards';
	// console.log(url2);
	$http.get(url2).then(function success(response){
		$rootScope.wards = response.data.wards;
	});
}]);