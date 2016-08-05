angular.module('houseDetail',[])
.directive('neighborRepeat', function(){
	return function(scope) {
		if (scope.$last){
			// console.log('success');
			// scope.$emit('LastRepeaterElement');
				scope.$watch(function(){
			    $('#exam').DataTable({
			    	retrieve : true,
			        responsive: {
			            details: {
			                type: 'column',
			                target: -1
			            }
			        },
			        columnDefs: [ {
			            className: 'control',
			            orderable: false,
			            targets: -1
			        }]
			    });
			});
		}
	};
})

.component('houseDetail', {
	controller: function HouseDetailController($scope, $http, $routeParams, AuthService, API, $sce, $cookies){

		var urlHouseDetail = API.getHouseDetail($routeParams.houseId);
		var request = {};

		$scope.select = "myHouse";
		$scope.choose = function(str){
			$scope.select = str;
/*			console.log('click at ' + str);*/
		}

		$scope.spanClick = "down";
		$scope.schoolClick = "down";
	 	reloadMap();

	 	function splitAddress(add){
			add = add.split(',');
			var len = add.length - 2;
			var s = "";
			for(var i = 0; i < len; i++){
				s += add[i];
			}
			return s;
		}

	 	function convertPrice(price){
			price = price * 1000000;
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

		$scope.radius = 1000;
		$scope.radiusDefault = 1000;
		$scope.chooseRadius = function(rad){
			$scope.radius = parseInt(rad);
			console.log($scope.radius);
			reloadMap();
		}



		function reloadMap() {
		$http.get(urlHouseDetail).then(function successCallback(response){
			var data = response.data;

			$scope.status = data.status;

			var house = data.houses[0];
			house.priceHouse = house.price;
			var add = house.address.split(',');
			var len = add.length;

			$scope.address = add[len-2] + ', '+  add[len-1];
			$cookies.put('districtAddress', add[len-2] + ', '+  add[len-1]);
			$cookies.put('districtID', house.district);
			$cookies.put('cityID', house.city);
			$cookies.put('price', house.price);

			$http.get(API.getAveragePrice('district', house.district))
			.then(function success(response){
				var avg = response.data;
				var medianSale = parseFloat((avg.avgPrice).toFixed(2));
				var listPrice = parseFloat(((avg.maxAvgListingPrice + avg.minAvgListingPrice)/2).toFixed(2));


				if(house.price > 0){
					var priceOfHouse =  parseFloat((house.price / house.area).toFixed(2));
					$scope.priceAverageOfHouse = priceOfHouse;
		
					/*------------COMPARE HOUSE PRICE WITH LISTING PRICE---------*/
					if(priceOfHouse < listPrice){
						$scope.listPricePercent = ((1 - priceOfHouse / listPrice) * 100).toFixed(1); 
					}
					else if(priceOfHouse > listPrice){
						// console.log('giá nhà cao hơn giá niêm yết');
						$scope.listPricePercent = ((1 - listPrice / priceOfHouse) * 100).toFixed(1);
					}
					else {
						$scope.listPricePercent = 'Bằng giá nhà';
					}

					/*------------COMPARE HOUSE PRICE WITH  MEDIAN SALE---------*/

					if(priceOfHouse < medianSale){
						$scope.medianSalePercent = ((1- priceOfHouse / medianSale) * 100).toFixed(1); 
					}
					else if(priceOfHouse > medianSale){
						$scope.medianSalePercent = ((1 - medianSale / priceOfHouse) * 100).toFixed(1);
					}
					else {
						$scope.medianSalePercent = 'Bằng giá nhà';
					}

				}

				if(!listPrice){
					$scope.listPrice = 'Chưa có dữ liệu';
				}
				else{
					$scope.listPrice = listPrice;
				}

				$scope.medianSale = medianSale;


				$scope.medianSaleConvert = convertPrice(medianSale);
				$scope.listPriceConvert = convertPrice(listPrice);
				$scope.avgPriceOfHouse = convertPrice(priceOfHouse);
			});
		

			//HOUSE SUGGEST FUNCTION
			function HouseSuggest(){
				var url = AuthService.hostName + '/api/houses?housefor=' + ((house.houseFor == 1) ?'sell' : 'rent')
												+'&city='+ house.city
												+ '&district=' + house.district
												+ '&specific=1';
				var urlNewest = url + '&offset=0&count=8';
				var urlBedRooms3 = url + '&bedrooms=3&count=6';
				var urlMaxPrice = url + '&count=8&maxPrice='+ house.price;
				var urlFloors4 = url + '&count=6&floors=4';
				// console.log(urlMaxPrice);
				$scope.priceSuggest = convertPrice($cookies.get('price'));

				$http.get(urlNewest).then(function success(response){
					$scope.newest = response.data.houses;
					for(var i in $scope.newest){
						if($scope.newest[i].price == 0){
							$scope.newest[i].price = "Thỏa thuận"
						}
						else {
							$scope.newest[i].price = convertPrice($scope.newest[i].price);
						}
						// console.log($scope.newest[i].price);
						$scope.newest[i].address = splitAddress($scope.newest[i].address);		
					}
				});

				$http.get(urlBedRooms3).then(function success(response){
					$scope.BedRooms3 = response.data.houses;
					for(var i in $scope.BedRooms3){
						if($scope.BedRooms3[i].price == 0){
							$scope.BedRooms3[i].price = "Thỏa thuận"
						}
						else {
							$scope.BedRooms3[i].price = convertPrice($scope.BedRooms3[i].price);
						}
						$scope.BedRooms3[i].address = splitAddress($scope.BedRooms3[i].address);		
					}
				});

				$http.get(urlMaxPrice).then(function success(response){
					$scope.MaxPrice = response.data.houses;
					for(var i in $scope.MaxPrice){
						if($scope.MaxPrice[i].price == 0){
							$scope.MaxPrice[i].price = "Thỏa thuận"
						}
						else {
							$scope.MaxPrice[i].price = convertPrice($scope.MaxPrice[i].price);
						}
						$scope.MaxPrice[i].address = splitAddress($scope.MaxPrice[i].address);		
					}
				});

				$http.get(urlFloors4).then(function success(response){
					$scope.Floors4 = response.data.houses;
					for(var i in $scope.Floors4){
						if($scope.Floors4[i].price == 0){
							$scope.Floors4[i].price = "Thỏa thuận"
						}
						else {
							$scope.Floors4[i].price = convertPrice($scope.Floors4[i].price);
						}
						$scope.Floors4[i].address = splitAddress($scope.Floors4[i].address);		
					}
				});
			}

			// END OF HOUSE SUGGEST
			HouseSuggest();

			$scope.house = house;
			$scope.housePriceConvert = convertPrice(house.price);
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


			/*---------------MARKER POSITION OF THE HOUSE----------- */

			$scope.map = {center: {latitude: latitude, longitude: longitude }, zoom: 15};
			console.log($scope.map);

		    /*--------FIND THE NEIGHBORHOOD NEAR YOUR HOUSE---------*/
			$http.get(API.getHousesNearby(($scope.house.houseFor > 0) ? 'sell' :'rent', $scope.house.city, $scope.house.district,$scope.house.ward)).then(
				function (near){
					neighbor = near.data.houses;
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
						var price = neighbor[i].price;
						neighbor[i].price =  price ? convertPrice(neighbor[i].price) : 'Thỏa thuận';
						if(neighbor[i].area == 0){
							neighbor[i].area = "_";
						}
						if(neighbor[i].noOfFloors == 0){
							neighbor[i].noOfFloors = "_";
						}
						if(neighbor[i].noOfBedrooms == 0){
							neighbor[i].noOfBedrooms = "_";
						}
						// console.log(neighbor[i].price);								
					}

					coor_neighbor = coor_neighbor.substring(1);
					$http.post(API.getDistanceNearBy(), {origin : position, 
														destination : coor_neighbor})
					.success(function(data, status){
						// console.log(data);
						if(status == 200 && data.status == 'success'){

							var res = data.results.rows[0];
							// console.log(res);
							if(res){
								var dist = res.elements;
								for(var i = 0; i < dist.length; i++){
									if(dist[i].distance){
										neighbor[i].distance = dist[i].distance.text;
									}
									else{
										neighbor[i].distance = '_';
									}
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
							content : content,
							url : "http://ngocdon.me/#!/houses/" + neighbor[i].id,
							options : {labelClass : 'marker_labels', labelContent : ''},
							icon : "../../asset/icon/neighbor.png"
						}
						coor_neighbor_marker.push(ret);
					}
					// console.log(coor_neighbor_marker);

				}
			);
			

		    /*--------FIND THE HOSPITAL NEAR THE HOUSE-----------*/
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
		    /*--------END OF FIND THE HOSPITAL NEAR THE HOUSE-----------*/

		    /*----------FIND RESTAURANT NEAR THE HOUSE----------*/
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
		    /*----------END OF FIND RESTAURANT NEAR THE HOUSE----------*/

		    /*-----------FIND THE CAFE NEAR THE HOUSE ----------*/
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
		    /*-----------END OF FIND THE CAFE NEAR THE HOUSE----------*/

		    /*---------FIND PARK NEAR THE HOUSE----------*/
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
		    /*---------END OF FIND PARK NEAR THE HOUSE----------*/

		    /*----------FIND BUS NEAR THE HOUSE------------*/
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
		    /*----------FIND BUS NEAR THE HOUSE------------*/

		    /*---------FIND BEAUTY SALON NEAR THE HOUSE----------*/
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

					$scope.utilities.push({title:'Thẩm mỹ - Làm đẹp', type : 'salon', quantity : salon.length});

		    	}
		    });
		    /*---------END OF FIND BEAUTY SALON NEAR THE HOUSE----------*/

		    /*----------FIND THE MARKET NEAR THE HOUSE----------*/
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
		    /*----------END OF FIND THE MARKET NEAR THE HOUSE----------*/


		    /*----------FIND THE SCHOOL NEAR THE HOUSE---------*/
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
				/*----------END OF FIND THE SCHOOL NEAR THE HOUSE---------*/
			});


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
			            },
			            click : function(marker, eventName, model, args){
			            	// console.log(model.url);
				          window.open(model.url, '_blank'); 
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
				console.log("_________10000____________");
				console.log($scope.map);
				console.log("_________10000____________");
			    $scope.options = {
			    	scrollwheel: false
			    };				    	

			    $scope.$watch(function(){
			    	return $scope.map.bounds;
			    }
		    	,function(ov, nv) {
		    		// if (!ov.southwest && nv.southwest) {
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


		});
	}

	
	
	},
	templateUrl: 'view/house-detail/house-detail.template.html'
});	