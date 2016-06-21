angular.module('viewHouse')
.component('viewHouse', {
	templateUrl: 'view/view-house/view-house.template.html',
	controller:['$http', function($http){
		var url = '../../data/houses.json';
		$http.get(url).then(function success(response){
			console.log(response);
			var self = this;
			self.house = response.data[0];
			console.log(self.house);
		},
		function error(response){
			// $scope.error = response.status;
		});
	}]
});	