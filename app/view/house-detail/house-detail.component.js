angular.module('houseDetail')
.component('houseDetail', {

	controller: function HouseDetailController($rootScope,$scope, $http, $log, $routeParams, API, $sce){
		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);

    	
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;

			$scope.select = "myHouse";
			$scope.choose = function(str){
				$scope.select = str;
				console.log('click at ' + str);
			}

			$scope.status = data.status;
			$scope.house = data.houses[0];
			$scope.house.description = $sce.trustAsHtml($scope.house.description);

			var latitude = $scope.house.lat;
			var longitude = $scope.house.lon;
			var position = latitude + ',' + longitude;


			var neighbor = [],
				coor_neighbor = "";
			var restaurant = []
		    	,coor_restaurant = "";
		    var hos = []
		    	,coor_hos = "";
		   	var cafe = []
		   		,coor_cafe = "";
		   	var park = []
		   		,coor_park = "";

			var primaries = []
				,juniors = []
				,seniors = [];
			var coor_primary = ""
				,coor_junior = ""
				,coor_senior = "";
			var school_list = [];
			var utilities = [];


			// marker position of the house 
			$scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 16};
		    // end location

		    //find the neighborhood near your house
			$http.get(API.getHousesNearby($scope.house.city, $scope.house.district,$scope.house.ward)).then(
				function (near){
					neighbor = near.data.houses;
/*					console.log('near.data.house');
					console.log(neighbor);*/
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
				 		+ "&destinations="+ coor_neighbor
				 		+ "&key=AIzaSyDLV4DIm4y3o6Bd7GRR725pmocPgzE3zwE"
				 	console.log(url);

					coor_neighbor = coor_neighbor.substring(1);
					$http.post(API.getDistanceNearBy(), {origin : position, 
														destination : coor_neighbor})
					.success(function(data, status){
						console.log(data);
						if(status == 200 && data.status == 'success'){

							var res = data.results.rows[0];
							if(res){
								for(var i in res.elements){
									neighbor[i].distance = res.elements[i].distance.text;
								}
							}
							$scope.neighbor = neighbor;
						}
					})
					.error(function(){
						console.log("fail");
					})

				}
			)


		    //find the hospital near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'hospital'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		for (var i in res){
		    			if(res[i].name.includes('Bệnh viện') || res[i].name.includes('Hospital') || res[i].name.includes('Phòng khám')){
		    				hos.push(res[i]);
		    				coor_hos += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
		    			}
		    		}
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_hos.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										hos[i].distance = res.elements[i].distance.text;
									}
								}
								hos.type = "hospital";
								hos.title = "Bệnh viện";

								$scope.hospital = hos;
							}
						})
		    	}
		    });
		    //find restaurant near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'restaurant'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;

		    		for (var i in res){
		    			restaurant.push(res[i]);
		    			coor_restaurant += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
		    		}
		    		restaurant.type = "restaurant";
					restaurant.title = "Nhà hàng";
					$scope.restaurant = restaurant;
		    	}
		    });

		    //find the cafe near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'cafe'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;

		    		for (var i in res){
	    				cafe.push(res[i]);
	    				coor_cafe += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
		    		}
					cafe.type = "cafe";
					cafe.title = "Cafe";
					$scope.cafe = cafe;
		    	}
		    });
		    //find park near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'park'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		console.log('park near');
		    		console.log(res);
		    		for (var i in res){
		    			if(res[i].name.includes("Công viên") || res[i].name.includes("Vườn hoa") || res[i].name.includes("Park")){

							park.push(res[i]);
							coor_park += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
		    		}
		    		console.log(park);
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_park.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										park[i].distance = res.elements[i].distance.text;
									}
									
								}
								park.type = "park";
								park.title = "Công viên";
								$scope.park = park;
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

								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										primaries[i].distance = res.elements[i].distance.text;
									}
									
								}
								primaries.type = "primary";
								primaries.title = "Trường cấp I";
								$scope.primaries = primaries;

							}
						})
					console.log(primaries.length);

					//filter junior school
					$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_junior.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){

								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										juniors[i].distance = res.elements[i].distance.text;
									}
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

								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										seniors[i].distance = res.elements[i].distance.text;
									}

								}
								seniors.type = "senior";
								seniors.title = "Trường cấp III";
								// console.log(seniors);
							}
						})

					school_list.push(primaries);
					school_list.push(juniors);
					school_list.push(seniors);

					$scope.school_list = school_list;
					console.log('school_list');
					console.log(school_list);

				}
			});



			setTimeout(function(){
				
				utilities.push({title:'Bệnh viện', type : 'hospital', quantity : hos.length});
				utilities.push({title:'Công viên', type : 'park', quantity : park.length});
				utilities.push({title:'Nhà hàng', type : 'restaurant', quantity : restaurant.length});
				utilities.push({title:'Cafe', type : 'cafe', quantity : cafe.length});
				$scope.utilities = utilities;
				 $scope.markers = [{
			      	id: 0,
			      	coords: {
			        	latitude: latitude,
			        	longitude: longitude
			      	},
			      	options: { draggable: true },
			      	icon : 'http://maps.google.com/mapfiles/kml/shapes/ranger_station.png'
			    }];
				var coor_neighbor_marker = [];
				for(var i in neighbor){
					var lat = neighbor[i].lat;
					var lon = neighbor[i].lon;
					coor_neighbor += '|' + lat + ',' + lon;
					var content = '<div><table class="table table-map"><tr><td>Địa chỉ</td>'
									+'<td>' + neighbor[i].address+'</td>'
									+'</tr><tr><td>Giá</td>'
									+'<td>' + neighbor[i].price+' triệu đồng'+'</td>'
									+'</tr></table></div>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						title : neighbor[i].address,
						price : neighbor[i].price,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/paddle/H.png"
					}
					coor_neighbor_marker.push(ret);
				}

				console.log(coor_neighbor_marker);

					
				var coor_primary_marker = [];
				for(var i = 0; i < primaries.length; i++){
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
	
				var coor_hos_marker = [];
				for(var i = 0; i < hos.length; i++){
					var lat = hos[i].geometry.location.lat;
					var lon = hos[i].geometry.location.lng;
					var content = '<p class="p-map">'+ hos[i].name + '</p>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal3/icon38.png"
					}
					coor_hos_marker.push(ret);
				}
				var coor_park_marker = [];
				for(var i = 0; i < park.length; i++){
					var lat = park[i].geometry.location.lat;
					var lon = park[i].geometry.location.lng;
					var content = '<p class="p-map">'+ park[i].name + '</p>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon4.png"
					}
					coor_park_marker.push(ret);
				}

				var coor_restaurant_marker = [];
				for(var i = 0; i < restaurant.length; i++){
					var lat = restaurant[i].geometry.location.lat;
					var lon = restaurant[i].geometry.location.lng;
					var content = '<p class="p-map">'+ restaurant[i].name + '</p>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon55.png"
					}
					coor_restaurant_marker.push(ret);
				}

				var coor_cafe_marker = [];
				for(var i = 0; i < cafe.length; i++){
					var lat = cafe[i].geometry.location.lat;
					var lon = cafe[i].geometry.location.lng;
					var content = '<p class="p-map">'+ cafe[i].name + '</p>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon19.png"
					}
					coor_cafe_marker.push(ret);
				}


				var coor_primary_marker = [];
				for(var i = 0; i < primaries.length; i++){
					var lat = primaries[i].geometry.location.lat;
					var lon = primaries[i].geometry.location.lng;
					var content = '<p class="p-map">'+ primaries[i].name + '</p>';
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon5.png"
					}
					coor_primary_marker.push(ret);
				}
				console.log(coor_primary_marker);
				var coor_junior_marker = [];
				for(var i = 0; i < juniors.length; i++){
					var lat = juniors[i].geometry.location.lat;
					var lon = juniors[i].geometry.location.lng;
					var content = "<p class='p-map'>"+ juniors[i].name + "</p>";
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon5.png"
					}
					coor_junior_marker.push(ret);

				}
				console.log(coor_junior_marker)

				var coor_senior_marker = [];
				for(var i = 0; i < seniors.length; i++){
					var lat = seniors[i].geometry.location.lat;
					var lon = seniors[i].geometry.location.lng;
					var content = "<p class='p-map'>"+ seniors[i].name + "</p>";
					var ret = {
						id : parseInt(i),
						latitude : lat,
						longitude : lon,
						content : content,
						options : {labelClass : 'marker_labels', labelContent : ''},
						icon : "http://maps.google.com/mapfiles/kml/pal2/icon5.png"
					}
					coor_senior_marker.push(ret);
				}

				//marker all school


				$scope.map = {
					center: {latitude: latitude, longitude: longitude }, 
					zoom: 14, 
					bounds : {},
					neighborMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			              	$scope.$digest() 
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			               $scope.$digest() 
			            }
			        },

			        hospitalMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			              	$scope.$digest() 
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			               $scope.$digest() 
			            }
			        },

			        parkMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			              	$scope.$digest() 
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			               $scope.$digest() 
			            }
			        },

			        restaurantMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			              	$scope.$digest() 
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			               $scope.$digest() 
			            }
			        },

			        cafeMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	$scope.$apply();
			              	$scope.$digest() 
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			               $scope.$digest() 
			            }
			        },

					primaryMarkersEvents : {
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
			        },

			        juniorMarkersEvents : {
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
			        },

			        seniorMarkersEvents : {
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
			        }
				};

			    $scope.options = {
			    	scrollwheel: false
			    };

			    $scope.$watch(function() {
			    	return $scope.map.bounds;
			    }, function() {
			    	$scope.hospitalMarkers = coor_hos_marker;
			    	$scope.parkMarkers = coor_park_marker;
			    	$scope.restaurantMarkers = coor_restaurant_marker;
			    	$scope.cafeMarkers = coor_cafe_marker;
			    	$scope.neighborMarkers = coor_neighbor_marker;
			    	$scope.primaryMarkers = coor_primary_marker;
			        $scope.juniorMarkers = coor_junior_marker;
			        $scope.seniorMarkers = coor_senior_marker;
			    }, true);



			}, 3000);

		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html'
});	