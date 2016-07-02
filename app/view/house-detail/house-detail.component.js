angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($scope, $http, $routeParams, API){
		// console.log($routeParams);
		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);
		var self = this;
		
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;
			self.status = data.status;
			self.house = data.houses[0];
			console.log(self.house.description);

			// self.house.description = data.houses.description;
			var latitude = self.house.lat;
			console.log(latitude);
			var longitude = self.house.lon;
			var position = latitude + ',' + longitude;
			console.log('pos = ' + position);
			var api = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + position + "&destinations=";
			var key = "&key=AIzaSyD2p-8sv_q6LMzBJyU526vs1F6cnW61-9A";
			var url = "http://localhost:3000/api/houses" + '?ward=' + self.house.ward + '&district=' + self.house.district + '&city=' + self.house.city + '&specific=1';

			self.showMap = { center: { latitude: latitude, longitude: longitude }, zoom: 16 };

			$http.post(API.getServicesNearBy(),{lat : latitude, 
															lon : longitude, 
															radius : 1000, 
															type : 'school'})
			.success(function(data, status){
				if(status == 200 && data.status == 'success'){
					var res = data.results.results;
					var primaries = []
						,juniors = []
						,seniors = [];
					var coor_primary = ""
						,coor_junior = ""
						,coor_senior = "";
					// console.log(res[res.length-1]);
					for(var i in res){
						if(res[i].name.includes("Tiểu học")){
							primaries.push(res[i]);
							coor_primary += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
						else if(res[i].name.includes("THCS")){
							juniors.push(res[i]);
							coor_junior += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
						else if(res[i].name.includes("THPT")){
							seniors.push(res[i]);
							coor_senior += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
					}
					console.log(api+coor_primary+key);
					console.log(position);
					console.log(coor_primary.substring(1));
					$http.post('http://localhost:3000/api/distance', {origin : position, destination : coor_primary.substring(1)})
					.success(function(data, status){
						if(status == 200 && data.status == 'success'){
							var res = data.results.rows[0].elements;
							console.log('res');
							console.log(res[res.length-1]);
							for(var i in res){
								primaries[i].distance = res[i].distance.text;
							}
							primaries.type = "primary";
							primaries.title = "Trường cấp I";
							console.log(primaries);
							self.primaries = primaries;
						}
					})
				}
				else {
					console.log("fail");
				}
			})

			$http.get(url).then(
				function (near){
					var coor_neighbor = '';
					var neighbor = near.data.houses;
					var log =[];
					for(var i in neighbor){
						if(neighbor[i].id == $routeParams.houseId){
							neighbor.splice(i,1);
						}

					}
					for(var i in neighbor){
						coor_neighbor += '|' + neighbor[i].lat + ',' + neighbor[i].lon;
					}
					coor_neighbor.substring(1);
					// console.log(api+coor_neighbor+key);
					$http.post('http://localhost:3000/api/distance', {origin : position, 
																	destination : coor_neighbor})
					.success(function(data, status){
						if(status == 200 && data.status == 'success'){
							var res = data.results.rows[0].elements;
							for(var i in res){
								neighbor[i].distance = res[i].distance.text;
							}
							self.neighbor = neighbor;
						}
					})

				}
			)
			
		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html',
	controllerAs: 'ctrl'
});	