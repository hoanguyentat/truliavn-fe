angular.module('viewHouse')
.component('viewHouse', {
	templateUrl: 'view/view-house/view-house.template.html',
	controller:['$http', function($http){
		var url = 'http://localhost:3000/api/house/24?raw=1';
		$http.get(url).then(function success(response){
			console.log(response);
			var self = this;
			self.house = response.data.house;
			console.log(self.house);
		},
		function error(response){
			// $scope.error = response.status;
		});
	}]
});