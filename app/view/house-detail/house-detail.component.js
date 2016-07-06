angular.module('houseDetail')
.component('houseDetail', {

	controller: function HouseDetailController($scope, $http, $log, $routeParams, API){
		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);
		var self = this;
		
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;
			self.status = data.status;
			self.house = data.houses[0];
			console.log(self.house);

			var latitude = self.house.lat;
			var longitude = self.house.lon;
			var position = latitude + ',' + longitude;


			// marker position of the house 
			self.showMap = { center: { latitude: latitude, longitude: longitude }, zoom: 16 };
			$scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 16 };
		    
		    $scope.options = {scrollwheel: false};
		    $scope.coordsUpdates = 0;
		    $scope.dynamicMoveCtr = 0;
		    $scope.marker = {
		      	id: 0,
			    	coords: {
			        	latitude: latitude,
			        	longitude: longitude
			      	},
			      	options: { draggable: true },
			      	events: {
		        		dragend: function (marker, eventName, args) {
		          		$log.log('marker dragend');
		          		var lat = marker.getPosition().lat();
		          		var lon = marker.getPosition().lng();
		          		$log.log(lat);
		          		$log.log(lon);

		          	$scope.marker.options = {
		            draggable: true,
			            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
			            labelAnchor: "100 0",
			            labelClass: "marker-labels"
		          	};
		        }
		      }
		    };

		    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
		      	if (_.isEqual(newVal, oldVal))
		        	return;
		     	$scope.coordsUpdates++;
		    });
		    // end location


		    // find the school near by
			$http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 1000, 
												type : 'school'})
			.success(function(data, status){
				if(status == 200 && data.status == 'success'){
					var res = data.results.results;
					var school_list = [];
					var primaries = []
						,juniors = []
						,seniors = [];
					var coor_primary = ""
						,coor_junior = ""
						,coor_senior = "";


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


					//filter primary school
					$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_primary.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows.elements;
								for(var i in res){
									primaries[i].distance = res[i].distance.text;
								}
								primaries.type = "primary";
								primaries.title = "Trường cấp I";
								console.log(primaries);
								self.primaries = primaries;
							}
						})

					//filter junior school
					$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_junior.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows.elements;
								for(var i in res){
									juniors[i].distance = res[i].distance.text;
								}
								juniors.type = "junior";
								juniors.title = "Trường cấp II";

								// console.log(juniors);
							}
						})

					//filter senior school
					$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_senior.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows.elements;
								for(var i in res){
									seniors[i].distance = res[i].distance.text;
								}
								seniors.type = "senior";
								seniors.title = "Trường cấp III";

								// console.log(seniors);
							}
						})

					school_list.push(primaries);
					school_list.push(juniors);
					school_list.push(seniors);
					console.log('school list');
					console.log(school_list);
					console.log('school list');
					self.school_list = school_list;
				}
			})


			//find the neighborhood near your house
			$http.get(API.getHousesNearby(self.house.city, self.house.district,self.house.ward)).then(
				function (near){
					var coor_neighbor = '';
					var coor_neighbor_marker=[];
					var neighbor = near.data.houses;
					var log =[];
					for(var i in neighbor){
						if(neighbor[i].id == $routeParams.houseId){
							neighbor.splice(i,1);
						}

					}
					for(var i in neighbor){
						var lat = neighbor[i].lat;
						var lon = neighbor[i].lon;
						coor_neighbor += '|' + lat + ',' + lon;
						
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							title : 'neighbor' + i
						}
						coor_neighbor_marker.push(ret);
					}
					coor_neighbor.substring(1);

					// console.log(coor_neighbor_marker);

					//marker all your neighborhood 
					$scope.map = {
					    center: {
					    	latitude: latitude,
					        longitude: longitude
					    },
					    zoom: 12,
					    bounds: coor_neighbor_marker
					    };
					    $scope.options = {
					    	scrollwheel: false
					    };
					  
					    $scope.randomMarkers = [];
					    // Get the bounds from the map once it's loaded
					    $scope.$watch(function() {
					    	return $scope.map.bounds;
					    }, function() {
					    	var markers = [];
					        for (var i = 0; i <$scope.map.bounds.length; i++) {
					          // console.log('i = ' + i);
					        	markers.push($scope.map.bounds[i])
					        }

					        $scope.randomMarkers = markers;
					    }, true);

					$http.post(API.getDistanceNearBy(), {origin : position, 
														destination : coor_neighbor})
					.success(function(data, status){
						if(status == 200 && data.status == 'success'){
							var res = data.results.rows.elements;
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