angular.module('houseDetail')
.component('houseDetail', {

	controller: function HouseDetailController($scope, $http, $log, $routeParams, API){
		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);
		var self = this;

		$scope.choosen = " ";
		
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;
			self.status = data.status;
			self.house = data.houses[0];

			var latitude = self.house.lat;
			var longitude = self.house.lon;
			var position = latitude + ',' + longitude;

			var neighbor = []
				,coor_neighbor = "";
			var primaries = []
				,juniors = []
				,seniors = [],
				all_school = [];
			var coor_primary = ""
				,coor_junior = ""
				,coor_senior = ""
				,coor_all_school = "";


			// marker position of the house 
			$scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 16 };
		    // end location

		    //find the neighborhood near your house
			$http.get(API.getHousesNearby(self.house.city, self.house.district,self.house.ward)).then(
				function (near){
					neighbor = near.data.houses;
					// console.log('near.data.house');
					// console.log(near.data.houses);
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
					}
					var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="
				 		+ position 
				 		+ "&destinations="+ coor_neighbor;
				 		+ "&key=AIzaSyDLV4DIm4y3o6Bd7GRR725pmocPgzE3zwE"

					coor_neighbor = coor_neighbor.substring(1);
					$http.post(API.getDistanceNearBy(), {origin : position, 
														destination : coor_neighbor})
					.success(function(data, status){
						if(status == 200 && data.status == 'success'){
							var res = data.results.rows[0].elements;
							console.log('res');
							console.log(res);
							console.log('res');
							for(var i in res){
								neighbor[i].distance = res[i].distance.text;
							}
							console.log(self.neighbor);
							self.neighbor = neighbor;
						}
					})
					.error(function(){
						console.log("fail");
					})

					var coor_neighbor_marker = [];
					// console.log('neighbor');
					// console.log(neighbor);
					for(var i in neighbor){
							var lat = neighbor[i].lat;
							var lon = neighbor[i].lon;
							coor_neighbor += '|' + lat + ',' + lon;
							var content = '<div><table class="table table-map"><tr><td>Địa chỉ</td>'
											+'<td>' + neighbor[i].address+'</td>'
											+'</tr><tr><td>Giá</td>'
											+'<td>' + neighbor[i].price+' tỉ đô'+'</td>'
											+'</tr></table></div>';
							var ret = {
								id : parseInt(i),
								latitude : lat,
								longitude : lon,
								title : neighbor[i].address,
								price : neighbor[i].price,
								content : content,
								options : {labelClass : 'marker_labels', labelContent : ''},
								icon : "http://maps.google.com/mapfiles/kml/paddle/grn-stars.png"
							}
							coor_neighbor_marker.push(ret);
					}

					// console.log('marker');
					// console.log(coor_neighbor_marker);

					//marker all your neighborhood 
					$scope.map = {
					    center: {
					    	latitude: latitude,
					        longitude: longitude
					    },
					    zoom: 16,
					    // primaryBounds: coor_primary_marker,
					    neighborBounds: coor_neighbor_marker
					};
				    $scope.options = {
				    	scrollwheel: false
				    };

				    $scope.neighborMarkers = [];
				    // Get the bounds from the map once it's loaded
				    $scope.$watch(function() {
				    	return $scope.map.neighborBounds;
				    }, function() {
				        var neighborMarkers = [];
				        for (var i = 0; i < $scope.map.neighborBounds.length; i++) {
				          // console.log('i = ' + i);
				        	neighborMarkers.push($scope.map.neighborBounds[i])
				        }

				        $scope.neighborMarkers = neighborMarkers;
				    }, true);

		    		$scope.map.neighborMarkersEvents = {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			            }
			        };


				}
			)
			

		    //find the hospital near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 2000, 
												type : 'hospital'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		var hos = [];
		    		var coor_hos = "";
		    		for (var i in res){
		    			if(res[i].name.includes('Bệnh viện')){
		    				hos.push(res[i]);
		    				coor_hos += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
		    			}
		    		}
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_hos.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								console.log(data.results);
								var res = data.results.rows[0].elements;
								for(var i in res){
									hos[i].distance = res[i].distance.text;
								}
								hos.type = "hospital";
								hos.title = "Bệnh viện";
								// console.log(hos);
								self.hospital = hos;
							}
						})
		    	}
		    });

		    // find the school near by
			$http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'school'})
			.success(function(data, status){
				if(status == 200 && data.status == 'success'){
					var res = data.results.results;
					var school_list = [];


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
					self.school_list = school_list;

					// console.log('primary');
					// console.log(primaries);
					// console.log('primary');
					var coor_primary_marker = [];
					for(var i in primaries){
						var lat = primaries[i].geometry.location.lat;
						var lon = primaries[i].geometry.location.lng;
						var content = '<p class="p-map">'+ primaries[i].name + '</p>';
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							title : "title",
							price : "price",
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "http://maps.google.com/mapfiles/kml/shapes/schools.png"
						}
						coor_primary_marker.push(ret);
					}
					var coor_junior_marker = [];
					for(var i in juniors){
						var lat = juniors[i].geometry.location.lat;
						var lon = juniors[i].geometry.location.lng;
						var content = "<p class='p-map'>"+ juniors[i].name + "</p>";
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							title : "title",
							price : "price",
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "http://maps.google.com/mapfiles/kml/shapes/schools.png"
						}
						coor_junior_marker.push(ret);
					}

					var coor_senior_marker = [];
					for(var i in seniors){
						var lat = seniors[i].geometry.location.lat;
						var lon = seniors[i].geometry.location.lng;
						var content = "<p class='p-map'>"+ seniors[i].name + "</p>";
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							title : "title",
							price : "price",
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "http://maps.google.com/mapfiles/kml/shapes/schools.png"
						}
						coor_senior_marker.push(ret);
					}

					//marker all your neighborhood 
					$scope.map = {
					    center: {
					    	latitude: latitude,
					        longitude: longitude
					    },
					    zoom: 12,
					    primaryBounds: coor_primary_marker,
					    juniorBounds : coor_junior_marker,
					    seniorBounds : coor_senior_marker
					};
				    $scope.options = {
				    	scrollwheel: false
				    };
				  
				    $scope.primaryMarkers = [];
				    // Get the bounds from the map once it's loaded
				    $scope.$watch(function() {
				    	return $scope.map.primaryBounds;
				    }, function() {
				    	var primaryMarkers = [];
				        for (var i = 0; i <$scope.map.primaryBounds.length; i++) {
				          // console.log('i = ' + i);
				        	primaryMarkers.push($scope.map.primaryBounds[i])
				        }

				        $scope.primaryMarkers = primaryMarkers;
				    }, true);

				    $scope.juniorMarkers = [];
				    $scope.$watch(function() {
				    	return $scope.map.juniorBounds;
				    }, function() {
				    	var juniorMarkers = [];
				        for (var i = 0; i <$scope.map.juniorBounds.length; i++) {
				          // console.log('i = ' + i);
				        	juniorMarkers.push($scope.map.juniorBounds[i])
				        }

				        $scope.juniorMarkers = juniorMarkers;
				    }, true);

				    $scope.seniorMarkers = [];
				    $scope.$watch(function() {
				    	return $scope.map.seniorBounds;
				    }, function() {
				    	var seniorMarkers = [];
				        for (var i = 0; i <$scope.map.seniorBounds.length; i++) {
				          // console.log('i = ' + i);
				        	seniorMarkers.push($scope.map.seniorBounds[i])
				        }

				        $scope.seniorMarkers = seniorMarkers;
				    }, true);


		    		$scope.map.primaryMarkersEvents = {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			            }
			        };

			        $scope.map.juniorMarkersEvents = {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			            }
			        };

			        $scope.map.seniorMarkersEvents = {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			            }
			        };

				}
			});
		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html',
	controllerAs: 'ctrl'
});	