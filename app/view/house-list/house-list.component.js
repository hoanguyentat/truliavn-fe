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
	}],
	controllerAs: 'ctrl'
});	