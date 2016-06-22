angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($http, $routeParams){
		console.log($routeParams);
		var url = 'http://localhost:3000/api/house/' + $routeParams.houseId;
		var self = this;
		$http.get(url).then(function success(response){
			console.log(response.data);
			self.house = response.data.house;
			console.log(self.house);
		});
		var status = self.house.status;
	},
	templateUrl: function(){
		console.log(status);
		if(status == "success"){
			return 'view/house-detail/house-detail.template.html';
		} 
		else{
			return 'view/error.template.html';
		}
	},
	controllerAs: 'ctrl'
});	