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
				coor_neighbor = "",
				coor_neighbor_marker = [];
			var restaurant = []
		    	,coor_restaurant = "",
		    	coor_restaurant_marker = [];
		    var hospital = []
		    	,coor_hospital = "",
		    	coor_hospital_marker=[];
		   	var cafe = []
		   		,coor_cafe = "",
		   		coor_cafe_marker=[];
		   	var park = []
		   		,coor_park = ""
		   		,coor_park_marker=[];
		   	var bus = []
		   		,coor_bus = ""
		   		,coor_bus_marker=[];
		   	var salon = []
		   		,coor_salon = ""
		   		,coor_salon_marker =[];
		   	var market = []
		   		,coor_market = ""
		   		,coor_market_marker=[];

			var primaries = []
				,juniors = []
				,seniors = [];
			var coor_primary = ""
				,coor_junior = ""
				,coor_senior = ""
				,coor_primary_marker=[]
				,coor_junior_marker=[]
				,coor_senior_marker=[];
			var school_list = [];
			$scope.utilities = [];


			// marker position of the house 
			$scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 15};
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
						// console.log(data);
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

					// var coor_neighbor_marker = [];
					for(var i in neighbor){
						var lat = neighbor[i].lat;
						var lon = neighbor[i].lon;
						coor_neighbor += '|' + lat + ',' + lon;
						var content = '<div class="div-map"><table class="table table-map"><tr><td>Địa chỉ</td>'
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
							icon : "../../asset/icon/neighbor.png"
						}
						coor_neighbor_marker.push(ret);
					}

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
		    			if(res[i].name.match(/BỆNH VIỆN|HOSPITAL|PHÒNG KHÁM|KHOA/gi)){
		    				hospital.push(res[i]);
		    				coor_hospital += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
		    			}
		    		}

		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_hospital.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										hospital[i].distance = res.elements[i].distance.text;
									}
								}

								// var coor_hospital_marker = [];
								for(var i = 0; i < hospital.length; i++){
									var lat = hospital[i].geometry.location.lat;
									var lon = hospital[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ hospital[i].name + '</p>'
												+ '<p class="p-map">'+ hospital[i].vicinity + '</p></div>';
									var ret = {
										id : parseInt(i),
										latitude : lat,
										longitude : lon,
										content : content,
										options : {labelClass : 'marker_labels', labelContent : ' '},
										icon : "../../asset/icon/hospital.png"
									}
									coor_hospital_marker.push(ret);
								}

								$scope.utilities.push({title:'Bệnh viện', type : 'hospital', quantity : hospital.length});
									
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

					// var coor_restaurant_marker = [];
					for(var i = 0; i < restaurant.length; i++){
						var lat = restaurant[i].geometry.location.lat;
						var lon = restaurant[i].geometry.location.lng;
						var content = '<div class="div-map"><p class="p-map">'+ restaurant[i].name + '</p>'
								+ '<p class="p-map">'+ restaurant[i].vicinity + '</p></div>';
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "../../asset/icon/restaurant.png"
						}
						coor_restaurant_marker.push(ret);
					}

					$scope.utilities.push({title:'Nhà hàng', type : 'restaurant', quantity : restaurant.length});
					console.log($scope.utilities);

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
		    		// var coor_cafe_marker = [];
					for(var i = 0; i < cafe.length; i++){
						var lat = cafe[i].geometry.location.lat;
						var lon = cafe[i].geometry.location.lng;
						var content = '<div class="div-map"><p class="p-map">'+ cafe[i].name + '</p>'
									+ '<p class="p-map">'+ cafe[i].vicinity + '</p></div>';
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "../../asset/icon/cafe.png"
						}
						coor_cafe_marker.push(ret);
					}

					$scope.utilities.push({title:'Cafe', type : 'cafe', quantity : cafe.length});
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
		    		// console.log('park near');
		    		// console.log(res);
		    		for (var i in res){
		    			if(res[i].name.match(/CÔNG VIÊN|VƯỜN HOA|PARK/gi)){

							park.push(res[i]);
							coor_park += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
		    		}
		    		// console.log(park);
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_park.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										park[i].distance = res.elements[i].distance.text;
									}
									
								}
								for(var i = 0; i < park.length; i++){
									var lat = park[i].geometry.location.lat;
									var lon = park[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ park[i].name + '</p>'
												+ '<p class="p-map">'+ park[i].vicinity + '</p></div>';
									var ret = {
										id : parseInt(i),
										latitude : lat,
										longitude : lon,
										content : content,
										options : {labelClass : 'marker_labels', labelContent : ''},
										icon : "../../asset/icon/park.png"
									}
									coor_park_marker.push(ret);
								}

								$scope.utilities.push({title:'Công viên', type : 'park', quantity : park.length});
							}
						})
		    	}
		    });

		    //find bus near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'bus_station'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		for (var i in res){
		    			var c =res[i].name.charAt(0);
		    			if(c >= "0" && c <= "9"){
							bus.push(res[i]);
							coor_bus += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
		    		}
		  
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_bus.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										bus[i].distance = res.elements[i].distance.text;
									}
									
								}

								for(var i = 0; i < bus.length; i++){
									var lat = bus[i].geometry.location.lat;
									var lon = bus[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ bus[i].name + '</p>'
												+ '<p class="p-map">'+ bus[i].vicinity + '</p></div>';
									var ret = {
										id : parseInt(i),
										latitude : lat,
										longitude : lon,
										content : content,
										options : {labelClass : 'marker_labels', labelContent : ''},
										icon : "../../asset/icon/bus.png"
									}
									coor_bus_marker.push(ret);
								}
								$scope.utilities.push({title:'Bến xe bus', type : 'bus', quantity : bus.length});


							}
						})




		    	}
		    });

		    //find beauty salon near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'beauty_salon'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		for (var i in res){
		    			if(res[i].name.match(/MỸ VIỆN|BEAUTY|SALON/gi)){
		    				// console.log(str);
							salon.push(res[i]);
							coor_salon += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
		    		}
				
					// var coor_salon_marker = [];
					for(var i = 0; i < salon.length; i++){
						var lat = salon[i].geometry.location.lat;
						var lon = salon[i].geometry.location.lng;
						var content = '<div class="div-map"><p class="p-map">'+ salon[i].name + '</p>'
									+ '<p class="p-map">'+ salon[i].vicinity + '</p></div>';
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							content : content,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "../../asset/icon/spa.png"
						}
						coor_salon_marker.push(ret);
					}

					$scope.utilities.push({title:'Salon - Làm đẹp', type : 'salon', quantity : salon.length});

		    	}
		    });
		    //find the market near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : 3000, 
												type : 'grocery_or_supermarket'})
		    .success(function(data, status){
		    	if(status == 200 && data.status == 'success'){
		    		var res = data.results.results;
		    		for (var i in res){
		    			if(res[i].name.match(/SIÊU THỊ|MART|PLAZA|TTTM/gi)){
		    				// console.log(str);
							market.push(res[i]);
							coor_market += '|' + res[i].geometry.location.lat + ',' + res[i].geometry.location.lng ;
						}
		    		}
		    		// console.log(market);
		    		$http.post(API.getDistanceNearBy(), {origin : position, destination : coor_market.substring(1)})
						.success(function(data, status){
							if(status == 200 && data.status == 'success'){
								var res = data.results.rows[0];
								if(res){
									for(var i in res.elements){
										market[i].distance = res.elements[i].distance.text;
									}
									
								}
								for(var i = 0; i < market.length; i++){
									var lat = market[i].geometry.location.lat;
									var lon = market[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ market[i].name + '</p>'
												+ '<p class="p-map">'+ market[i].vicinity + '</p></div>';
									var ret = {
										id : parseInt(i),
										latitude : lat,
										longitude : lon,
										content : content,
										options : {labelClass : 'marker_labels', labelContent : ''},
										icon : "../../asset/icon/market.png"
									}
									coor_market_marker.push(ret);
								}
								$scope.utilities.push({title:'Trung tâm thương mại', type : 'market', quantity : market.length});
								// console.log($scope.utilities);
								// $scope.market = market;
							}
						})

					// var coor_market_marker = [];

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

					// console.log('primary');
					// console.log(primaries);

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

								for(var i = 0; i < primaries.length; i++){
									var lat = primaries[i].geometry.location.lat;
									var lon = primaries[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ primaries[i].name + '</p>'
												+ '<p class="p-map">'+ primaries[i].vicinity + '</p></div>';
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
								primaries.type = "primary";
								primaries.title = "Trường cấp I";
								// $scope.primaries = primaries;

							}
						})
					// console.log(primaries.length);

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

								for(var i = 0; i < juniors.length; i++){
									var lat = juniors[i].geometry.location.lat;
									var lon = juniors[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ juniors[i].name + '</p>'
												+ '<p class="p-map">'+ juniors[i].vicinity + '</p></div>';
									var ret = {
										id : parseInt(i),
										latitude : lat,
										longitude : lon,
										content : content,
										options : {labelClass : 'marker_labels', labelContent : ' '},
										icon : "http://maps.google.com/mapfiles/kml/pal2/icon5.png"
									}
									coor_junior_marker.push(ret);

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

								for(var i = 0; i < seniors.length; i++){
									var lat = seniors[i].geometry.location.lat;
									var lon = seniors[i].geometry.location.lng;
									var content = '<div class="div-map"><p class="p-map">'+ seniors[i].name + '</p>'
												+ '<p class="p-map">'+ seniors[i].vicinity + '</p></div>';
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
								seniors.type = "senior";
								seniors.title = "Trường cấp III";
								// console.log(seniors);
							}
						})

					school_list.push(primaries);
					school_list.push(juniors);
					school_list.push(seniors);

					$scope.school_list = school_list;
					// console.log('primary');
					// console.log(primaries);

				}
			});

			setTimeout(function(){
				
/*				utilities.push({title:'Bệnh viện', type : 'hospital', quantity : hos.length});
				utilities.push({title:'Công viên', type : 'park', quantity : park.length});
				utilities.push({title:'Bến xe bus', type : 'bus', quantity : bus.length});
				utilities.push({title:'Trung tâm thương mại', type : 'market', quantity : market.length});
				utilities.push({title:'Salon - Làm đẹp', type : 'salon', quantity : salon.length});
				utilities.push({title:'Nhà hàng', type : 'restaurant', quantity : restaurant.length});
				utilities.push({title:'Cafe', type : 'cafe', quantity : cafe.length});
				// console.log($scope.utilities);*/
				$scope.selected = $scope.utilities[0];

				console.log(coor_neighbor_marker);
				console.log(longitude +'-'+ latitude);

				$scope.markers = [{
			      	id: 0,
			      	coords: {
			        	latitude: latitude,
			        	longitude: longitude
			      	},
			      	options: { draggable: true },
			      	icon : '../../asset/icon/house.png'
			    }];

				$scope.map = {
					center: {latitude: latitude, longitude: longitude }, 
					zoom: 16, 
					bounds : {},
					neighborMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			            	// console.log('you have mouseover');
			              	model.options.labelContent = model.content;
			              	marker.showWindow = true;
			              	// model.show =  true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			            	// console.log('you have mouseout');
			               model.options.labelContent = ' ';
			               marker.showWindow = false;
			               $scope.$apply();
			            }
			        },

			        hospitalMarkersEvents : {
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

			        parkMarkersEvents : {
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

			        restaurantMarkersEvents : {
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

			        cafeMarkersEvents : {
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
			       	busMarkersEvents : {
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
			        salonMarkersEvents : {
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

			        marketMarkersEvents : {
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

			    $scope.$watchCollection(function(){
			    	return $scope.map.bounds;
			    }
		    	,function(ov, nv) {
		    		if (!ov.southwest && nv.southwest) {
				        console.log($scope.map.bounds);
				    }

			       	$scope.neighborMarkers = coor_neighbor_marker;
			    	$scope.hospitalMarkers = coor_hospital_marker;
			    	$scope.parkMarkers = coor_park_marker;
			    	$scope.restaurantMarkers = coor_restaurant_marker;
			    	$scope.cafeMarkers = coor_cafe_marker;
			    	$scope.busMarkers = coor_bus_marker;
			    	$scope.salonMarkers = coor_salon_marker;
			    	$scope.marketMarkers = coor_market_marker;
			    	$scope.primaryMarkers = coor_primary_marker;
			        $scope.juniorMarkers = coor_junior_marker;
			        $scope.seniorMarkers = coor_senior_marker;

		    	} 
		    	,true);

			}, 1500);

		});
	},
	templateUrl: 'view/house-detail/house-detail.template.html'
});	