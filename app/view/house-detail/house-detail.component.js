angular.module('houseDetail')
.component('houseDetail', {
	controller: function HouseDetailController($scope, $http, $routeParams){
		// console.log($routeParams);
		var url = 'http://localhost:3000/api/house/' + $routeParams.houseId + '?raw=1';
		var self = this;
	
		$http.get(url).then(function successCallback(response){
			var data = response.data;
			self.status = data.status;
			self.house = data.houses[0];
			console.log(self.house.ward);

			self.house.description = data.houses.description;
			var latitude = self.house.lat;
			console.log(latitude);
			var longitude = self.house.lon;
			var position = latitude + ',' + longitude;
			console.log('pos = ' + position);
			var api = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + position + "&destinations=";
			var key = "&key=AIzaSyD2p-8sv_q6LMzBJyU526vs1F6cnW61-9A";
			var url = "http://localhost:3000/api/houses" + '?ward=' + self.house.ward + '&district=' + self.house.district + '&city=' + self.house.city + '&specific=1';
			console.log(url);
			self.txt = "kien";

			self.initMap = 
			   "var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';"
      			+"var labelIndex = 0;"
				+"function initialize() {"
			        +"var pos = { lat:" + latitude + ", lng:" +  longitude + "};"
			        +"var map = new google.maps.Map(document.getElementById('map'), {"
			          +"zoom: 12,"
			          +"center: pos"
			        +"});"

			        // This event listener calls addMarker() when the map is clicked.
			        +"google.maps.event.addListener(map, 'click', function(event) {"
		          	+"addMarker(event.latLng, map);"
			        +"});"

			        // Add a marker at the center of the map.
			        +"addMarker(pos, map);"
			      +"}"

			      // Adds a marker to the map.
			      +"function addMarker(location, map) {"
			        // Add the marker at the clicked location, and add the next-available label
			        // from the array of alphabetical characters.
			        "var marker = new google.maps.Marker({"
			          +"position: location,"
			          +"label: labels[labelIndex++ % labels.length],"
			          +"map: map"
			        +"});"
			      +"}"

      			+"google.maps.event.addDomListener(window, 'load', initialize);";
			/*'function initMap() {' + 
				'var mapDiv = document.getElementById("map") ;' 
				+'var map = new google.maps.Map(mapDiv,{' 
					+'center : { lat :' + latitude + ',' + 'lng :' + longitude + ' },'
					+ 'zoom : 8' 
				+'});'
				+ 'var iconBase = "https://maps.google.com/mapfiles/kml/shape/";'
				+ 'var marker = new google.maps.Marker({'
				+ 'position: {lat :' + latitude + ',' + 'lng :' + longitude + ' },'
				+ 'map: map,'
				+ 'icon: iconBase + "schools_maps.png"'
				+'});'
			+'}';*/


			$http.post('http://localhost:3000/api/nearby',{lat : latitude, 
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