angular.module('houseList')
.component('allHouse', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', function($http){
		var url = '../../data/houses.json';
		$http.get(url).then(function success(response){
			// console.log(response);
			var list = this;
			list.house = response.data[1];
			// console.log(list.house);
		});
	}]
});	