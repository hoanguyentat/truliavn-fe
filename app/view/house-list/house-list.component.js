angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', function($http){
		var url = 'http://localhost:3000/api/houses';
		var list = this;
		$http.get(url).then(function success(response){
			list.houses = response.data.houses;
			console.log(list.houses);
		});
		$http.get('http://localhost:3000/api/districts').then(function success(response){
			list.districts = response.data.districts;
			console.log(list.districts);
		});
		var url2 = 'http://localhost:3000/api/wards?districts=' + list.districtSelected;
		console.log(url2);
		$http.get(url2).then(function success(response){
			list.wards = response.data.wards;
			console.log(list.wards);
		});
		
	}],
	controllerAs: 'ctrl'
});	