angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($http, $routeParams){
		var url = '../../data/houses.json';
		var self = this;
		$http.get(url).then(function success(response){

			self.house = response.data[0];
		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html',
	controllerAs: 'ctrl'
});	