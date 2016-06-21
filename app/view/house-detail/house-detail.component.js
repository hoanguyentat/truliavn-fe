angular.module('viewHouse')
.component('viewHouse', {
	controller: ['$http', '$scope', function ViewHouseController($http, $scope){
		var url = '../../data/houses.json';
		$http.get(url).then(function success(response){
			// console.log(response);
			var self = this;
			self.house = response.data[0];
			console.dir(self.house);
		},
		function error(response){
			// $scope.error = response.status;
		});
	}],
	templateUrl: 'view/house-detail/house-detail.template.html'
});	