angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($http, $routeParams){
		// console.log($routeParams);
		var url = 'http://localhost:3000/api/house/' + $routeParams.houseId;
		var self = this;
		
		$http.get(url).then(function successCallback(response){
			self.status = response.data.status;
			self.house = response.data.house;

			self.house.description = self.house.description.slice(0, 150) + "...";
		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html',
	controllerAs: 'ctrl'
});	