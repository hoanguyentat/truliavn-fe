angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($http, $routeParams){
		console.log($routeParams);
		var url = 'http://localhost:3000/api/house/' + $routeParams.houseId;
		var self = this;
		var status;
		$http.get(url).then(function success(response){
			self.house = response.data.house;
			console.log(response.data);
			status = response.data.status;
			console.log(status);
		});
		console.log(status);
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