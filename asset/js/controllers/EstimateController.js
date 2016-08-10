app.controller('EstimateController', ['$scope', '$http', '$routeParams', 'AuthService','API', '$cookies', 
function($scope, $http, $routeParams, AuthService,API, $cookies){
	// console.log($cookies.get('price'));
	var address = '';
	var disName = "";
	var cityName = "";
	var request = {};
	
	var temp  = $cookies.get('districtAddress').split(',');
	$scope.districtPriceName =  temp[0];
	$scope.cityPriceName =  temp[1];

	if(!disName && !cityName){
		$scope.address = $cookies.get('districtAddress');
	}
	// console.log(API.getAveragePrice('district', $scope.districtSelected ? $scope.districtSelected : $cookies.get('districtID')));

	$http.get(API.getAveragePrice('district', $scope.districtSelected ? $scope.districtSelected : $cookies.get('districtID')))
		.then(function success(response){
			var avg = response.data;
			$scope.avgDistrictMedianSale = (avg.avgPrice).toFixed(2);
			$scope.avgDistrictListPrice  = ((avg.minAvgListingPrice + avg.maxAvgListingPrice)/2).toFixed(2);

		})


	// console.log(address);
	// console.log($cookies.get('districtID'));
	// console.log($cookies.get('cityID'));


	function splitAddress(add){

	// function splitAddress(add){
		add = add.split(',');
		var len = add.length;
		if(len >= 4){
			return add[0] + add[1];
		}
		else 
			return add[0];
	}
	
	convertPrice = function(price){
	// function convertPrice(price){
		price = price * 1000 * 1000;
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
		return s + ' VNĐ';

	}

	//EVENTS WHEN CLICK ON ESTIMATE

	$http.get(API.getPrice()).then(function success(response){
		$scope.distEstimate = response.data.data;
		// console.log(response.data.data);
	});

	$scope.posChange = function(){
		if($scope.posSelected > 0){
			$scope.holderStr = "Mặt tiền của nhà rộng bao nhiêu mét ?";
		}
		else if($scope.posSelected == 0){
			$scope.holderStr = "Nhà cách đường to bao nhiêu mét ?";
		}
	}

	$scope.distEstChange = function(){
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

		// console.log('pos : ' + $scope.posSelected);
		// console.log('street : ' + $scope.streetEstSelected);
		// console.log('width : ' + $scope.houseWidth);
		// console.log('deep : ' + $scope.houseDeep);

		request.area = $scope.houseArea;
		// console.log(request);
		$http.post(API.getPrice(), request)
		.then(function success(response){
			// console.log(response.data.price);
			$scope.priceEstimate  = convertPrice(response.data.price / 1000);
		},
		function error(response){
			console.log(response);
		});
	}

	//END OF EVENTS WHEN CLICK ON ESTIMATE

	//HOUSE SUGGEST FUNCTION
	function HouseSuggest(){
		var url = "";
		if(disName && cityName){
			url = AuthService.hostName + '/api/houses?housefor=sell&city='+ $scope.citySelected
										+ '&district=' + $scope.districtSelected
										+ '&specific=1';
		}
		else if(!disName && !cityName){
			url = AuthService.hostName + '/api/houses?housefor=sell&city='+ $cookies.get('cityID')
										+ '&district=' + $cookies.get('districtID')
										+ '&specific=1';
		}
		var urlNewest = url + '&offset=0&count=8&userId=' + $cookies.get('user.id');
		var urlBedRooms3 = url + '&bedrooms=3&count=6&userId=' + $cookies.get('user.id');
		var urlMaxPrice = url + '&count=8&maxPrice='+ $cookies.get('price') + '&userId=' + $cookies.get('user.id');
		var urlFloors4 = url + '&count=6&floors=4&userId=' + $cookies.get('user.id');

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


	//EVENTS WHEN CLICK THE SEARCH HOUSE BY ADDRESS INCLUDES SELECT : DISTRICT, CITY

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	
	});
	$scope.cityChange = function(){
		cityName = $scope.cities[$scope.citySelected].cityName;
		// console.log(address);
		$http.get(AuthService.hostName + '/api/districts?city=' + $scope.citySelected).then(function success(response){
			$scope.districts = response.data.districts;
		});
	}
	$scope.districtChange = function(){
			// console.log(API.getAveragePrice('district', $scope.districtSelected ? $scope.districtSelected : $cookies.get('districtID')));

	$http.get(API.getAveragePrice('district', $scope.districtSelected ? $scope.districtSelected : $cookies.get('districtID')))
		.then(function success(response){
			var avg = response.data;
			$scope.avgDistrictMedianSale = (avg.avgPrice).toFixed(2);
			$scope.avgDistrictListPrice  = ((avg.minAvgListingPrice + avg.maxAvgListingPrice)/2).toFixed(2);

		})
		disName = $scope.districts[$scope.districtSelected].districtName;
		HouseSuggest();

		address = disName.concat(' ',cityName);
		urlHouseInDistrict = API.getHousesNearby('sell',$scope.citySelected,$scope.districtSelected);
		$scope.districtPriceName = disName;
		$scope.cityPriceName = cityName;

		$scope.address = disName.concat(', ',cityName);
		// console.log('add : ' + address);
		address= address.toLowerCase(); 
		address= address.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a"); 
		address= address.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e"); 
		address= address.replace(/ì|í|ị|ỉ|ĩ/g, "i"); 
		address= address.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"); 
		address= address.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u"); 
		address= address.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y"); 
		address= address.replace(/đ/g, "d"); 

		// console.log('url : ' + urlHouseInDistrict);

		$http.get(urlHouseInDistrict).then(function success(response){
			var house = response.data.houses;
			// console.log(house);
			coor_marker = [];
			for(var i in house){
				var ret = {
					id : parseInt(i),
					latitude : house[i].lat,
					longitude : house[i].lon,
					content : '<div class="div-map"><p class="p-map">'+ house[i].address + '</p>'+
							'<p class="p-map">Giá : '+ (house[i].price ? convertPrice(house[i].price) : "Thỏa thuận") + '</p></div>',
					url : 'http://ngocdon.me/#!/houses/' + house[i].id,
					icon : '../../../asset/icon/estimate.png',
					options : {labelClass : 'marker_labels', labelContent : ""}
				}
				coor_marker.push(ret);
			}
			$http.post(API.getCoordinate(),{address : address})
			.success(function(data, status){
				// console.log(data);
				if(status == 200 && data.status == 'success'){
					var coor = data.coordinate.results[0].geometry.location;
					// console.log(coor.lat + ',' + coor.lng);
					$scope.map = {
						center: {
							latitude : coor.lat,
							longitude : coor.lng
						}, 
						zoom: 14, 
						bounds : {},
						nearMarkersEvents : {
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
				            },
				            click : function(marker, eventName, model, args){
				            	// console.log(model.url);
				          		window.open(model.url, '_blank'); 
				            	$scope.$apply();
				            }
				        },
					};

				    $scope.options = {
				    	scrollwheel: false
				    };				    	

				    $scope.$watchCollection(
				    	function(){}
						,function() {$scope.nearMarkers = coor_marker;} 
						,true
					);			
				}
			})

			$scope.search = function(){
				// console.log('START SEARCH');
				$scope.select = true;
			}

		});
	}

}]);