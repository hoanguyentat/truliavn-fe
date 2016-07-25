app.controller('HouseDetailController', ['$rootScope','$scope', '$http', '$log', '$routeParams', 'API', '$sce','$cookies',
	function($rootScope,$scope, $http, $log, $routeParams, API, $sce, $cookies){
		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);

				var request = {};

		function convertPrice(price){
			price *= 1000000;
			var s= '';
			do {
	          	var n = price%1000;
	          	var str = "";
	          	var tmp =  n.toString();
	          	price = Math.floor(price/1000);
	          	if(price){
			    	str = '.' + (n ? (n < 10 ? ('00' + tmp) : (n < 100 ? ('0' + tmp) : tmp)) : '000');
	          	}
	          	else {
	            	str = tmp; 
	          	}

			  	s = str.concat(s);

			} while(price/1000>0);

			return s;
		}

		$http.get(API.getPrice()).then(function success(response){
			$scope.distEstimate = response.data.data;
			console.log(response.data.data);
		});

		$scope.posChange = function(){
			console.log($scope.posSelected);
			if($scope.posSelected > 0){
				$scope.holderStr = "Mặt tiền của nhà rộng bao nhiêu mét ?";
			}
			else if($scope.posSelected == 0){
				$scope.holderStr = "Nhà cách đường to bao nhiêu mét ?";
			}
		}

		$scope.distEstChange = function(){
			console.log($scope.disEstSelected);
			$scope.streetEstimate = $scope.distEstimate[$scope.disEstSelected];
		};

		$scope.streetEstChange = function(){
		}


		$scope.estimate = function(){
			request.frontend = $scope.posSelected;
			request.street = $scope.streetEstSelected;
			if($scope.posSelected > 0){
				request.wide = $scope.houseWD;
				request.deep = 0;
			}
			else{
				request.deep = $scope.houseWD;
				request.wide = 0;
			}

			request.area = $scope.houseArea;
			console.log(request);
			$http.post(API.getPrice(), request)
			.then(function success(response){
				$scope.priceEstimate  = convertPrice(response.data.price);
			},
			function error(response){
				console.log(response);
			});
		}

		$scope.select = "myHouse";
		$scope.choose = function(str){
			$scope.select = str;
			console.log('click at ' + str);
		}

		$scope.spanClick = "down";
		$scope.schoolClick = "down";
	 	reloadMap();
		$scope.radius = 1000;
		$scope.chooseRadius = function(rad){
			$scope.radius = parseInt(rad);
			// console.log($scope.radius);
			reloadMap();
		}

		function reloadMap() {
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;



			$scope.status = data.status;
			$scope.house = data.houses[0];
			$scope.house.price = convertPrice($scope.house.price);

			// console.log(($scope.house.houseFor > 0) ? 'sell' :'rent');
			
			$cookies.putObject('houseInfo', data.houses[0]);
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
		    // console.log(API.getHousesNearby(($scope.house.houseFor > 0) ? 'sell' :'rent', $scope.house.city, $scope.house.district,$scope.house.ward));
			$http.get(API.getHousesNearby(($scope.house.houseFor > 0) ? 'sell' :'rent', $scope.house.city, $scope.house.district,$scope.house.ward)).then(
				function (near){
					neighbor = near.data.houses;
					// console.log('near.data.house');
					// console.log(neighbor);
					var log =[];
					$scope.addressDistrict = neighbor[0].district + ', ' + neighbor[0].city;  
					for(var i in neighbor){
						if(neighbor[i].id == $routeParams.houseId){
							neighbor.splice(i,1);
						}

					}
					for(var i in neighbor){
						var lat = neighbor[i].lat;
						var lon = neighbor[i].lon;
						coor_neighbor += '|' + lat + ',' + lon;
						neighbor[i].price = convertPrice(neighbor[i].price);
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
										+'<td>' + neighbor[i].price+' VNĐ'+'</td>'
										+'</tr></table></div>';
						var ret = {
							id : parseInt(i),
							latitude : lat,
							longitude : lon,
							title : neighbor[i].address,
							price : neighbor[i].price,
							content : content,
							options : {labelClass : 'marker_labels',  labelAnchor: '12 60', labelContent : ''},
							icon : "../../asset/icon/neighbor.png"
						}
						coor_neighbor_marker.push(ret);
					}
					// console.log(coor_neighbor_marker);

				}
			)


		    //find the hospital near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : $scope.radius, 
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
												radius : $scope.radius, 
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
					// console.log($scope.utilities);

		    	}
		    });

		    //find the cafe near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : $scope.radius, 
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
												radius : $scope.radius, 
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
												radius : $scope.radius, 
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
												radius : $scope.radius, 
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

					$scope.utilities.push({title:'Thẩm mỹ viện - Làm đẹp', type : 'salon', quantity : salon.length});

		    	}
		    });
		    //find the market near by
		    $http.post(API.getServicesNearBy(),{lat : latitude, 
												lon : longitude, 
												radius : $scope.radius, 
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
								$scope.utilities.push({title:'Siêu thị - Mua sắm', type : 'market', quantity : market.length});
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
												radius : $scope.radius, 
												type : 'school'})
			.success(function(data, status){
				if(status == 200 && data.status == 'success'){
					var res = data.results.results;
					// console.log(data.results);

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

					console.log('primary');
					console.log(primaries);

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
								primaries.click = "primaryClick";
								primaries.up = "primaryUp";
								primaries.down = "primaryDown";
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
								juniors.up = "juniorUp";
								juniors.down = "juniorDown";
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
								seniors.up = "seniorUp";
								seniors.down = "seniorDown";
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
				$scope.selected = $scope.utilities[0];

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
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	// marker.showWindow =  true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        hospitalMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        parkMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        restaurantMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        cafeMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },
			       	busMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },
			        salonMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        marketMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },


					primaryMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        juniorMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        },

			        seniorMarkersEvents : {
			            mouseover: function (marker, eventName, model, args) {
			              	model.options.labelContent = model.content;
			              	model.show = true;
			              	$scope.$apply();
			            },
			            mouseout: function (marker, eventName, model, args) {
			               model.options.labelContent = ' ';
			               model.show = false;
			               $scope.$apply();
			            }
			        }
				};

			    $scope.options = {
			    	scrollwheel: false
			    };				    	

			    $scope.neighborMarkers = [];
		    	$scope.hospitalMarkers = [];
		    	$scope.parkMarkers =[];
		    	$scope.restaurantMarkers =[];
		    	$scope.cafeMarkers =[];
		    	$scope.busMarkers =[];
		    	$scope.salonMarkers =[];
		    	$scope.marketMarkers =[];
		    	$scope.primaryMarkers =[];
		        $scope.juniorMarkers =[];
		        $scope.seniorMarkers =[];
			    $scope.$watch('bounds'
			    	,function() {	$scope.neighborMarkers = coor_neighbor_marker;} 
			    	,true);

		    	$scope.$watch('bounds'
			    	,function() {$scope.hospitalMarkers = coor_hospital_marker;} 
			    	,true);

		    	$scope.$watch('bounds'
		    		,function() {$scope.parkMarkers = coor_park_marker;} 
		    		,true
		    	);
		    	$scope.$watch('bounds'
		    		,function() {$scope.restaurantMarkers = coor_restaurant_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() {$scope.cafeMarkers = coor_cafe_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() {$scope.busMarkers = coor_bus_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() {$scope.salonMarkers = coor_salon_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() {$scope.marketMarkers = coor_market_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() {$scope.primaryMarkers = coor_primary_marker;} 
		    		,true
		    	);

		    	$scope.$watch('bounds'
		    		,function() { $scope.juniorMarkers = coor_junior_marker;} 
		    		,true
		    	);
		    	$scope.$watch('bounds'
		    		,function() {  $scope.seniorMarkers = coor_senior_marker;} 
		    		,true
		    	);

			}, 1500);

		});
	}

}]);
