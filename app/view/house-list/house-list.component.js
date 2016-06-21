angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', function($http){
		var url = '../../data/houses.json';
		var list = this;
		$http.get(url).then(function success(response){
			list.houses = response.data;
			console.log(list.houses);
		});
	}],
	controllerAs: 'ctrl'
});	