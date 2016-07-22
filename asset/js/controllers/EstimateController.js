app.controller('EstimateController', ['$scope', '$http', '$routeParams', 'AuthService','API', '$cookies', 
function($scope, $http, $routeParams, AuthService,API, $cookies){
	$scope.house = $cookies.getObject('houseInfo');
	var address = " ";
	var disName = " ";
	var cityName = " ";
	var request = {};
	console.log(API.getPrice());

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
		console.log(request);
		$http.post(API.getPrice(), request)
		.then(function success(response){
			var price = parseInt(response.data.price);
			console.log(price);
			var str = " ";
			while(price > 1000){
				// console.log(price%1000);
				// console.log(Math.floor(price/1000));
				var s = " ";
				if((price%1000) == 0){
					s = ' ' + '000';
				}
				else{
					s = ' ' + (price%1000).toString();
				}

				str = s.concat(str);
				price = Math.floor(price/1000);
			}

			var s = price.toString()
			$scope.priceEstimate = s.concat(str) + ' ' + '000' + ' VNĐ';
		},
		function error(response){
			console.log(response);
		});
	}

	$http.get(AuthService.hostName + '/api/cities').then(function success(response){
		$scope.cities = response.data.cities;
	
	});
	$scope.cityChange = function(){
		cityName = $scope.cities[$scope.citySelected].cityName;
		console.log(address);
		$http.get(AuthService.hostName + '/api/districts?city=' + $scope.citySelected).then(function success(response){
			$scope.districts = response.data.districts;
		});
	}
	$scope.districtChange = function(){
		disName = $scope.districts[$scope.districtSelected].districtName;
		if(!address){
			address = tmp.formatted_address;
		}
		else {
			address = disName.concat(' ',cityName);
		}
		console.log(address);
		$scope.address = address;
		address= address.toLowerCase(); 
		address= address.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a"); 
		address= address.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e"); 
		address= address.replace(/ì|í|ị|ỉ|ĩ/g, "i"); 
		address= address.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"); 
		address= address.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u"); 
		address= address.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y"); 
		address= address.replace(/đ/g, "d"); 
		console.log(address);
		var urlHouseInDistrict = API.getHousesNearby($scope.citySelected,$scope.districtSelected);
		var latOfDistrict = "";
		var lonOfDistrict = "";

		$http.get(urlHouseInDistrict).then(function success(response){
			var house = response.data.houses;
			console.log(house);
			coor_marker = [];
			for(var i in house){
				var ret = {
					id : parseInt(i),
					latitude : house[i].lat,
					longitude : house[i].lon,
					content : '<div class="div-map"><p class="p-map">'+ house[i].price + '</p></div>',
					options : {labelClass : 'marker_labels', labelContent : " "}
				}
				coor_marker.push(ret);
			}

		});

		$http.post(API.getCoordinate(),{address : address})
		.success(function(data, status){
			console.log(data);
			if(status == 200 && data.status == 'success'){
				var coor = data.coordinate.results[0].geometry.location;
				console.log(coor.lat + ',' + coor.lng);
				$scope.map = {
					center: {
						// latitude: 21.0090571,
						// longitude: 105.8607507
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
			            }
			        },
				};
				console.log($scope.map.center);

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
		console.log('address : ' + address);
		setTimeout(function(){
			$scope.search = function(){
				$scope.select = 'search';
			}
		}, 1500);

/*		setTimeout(function(){
		$scope.map = {
				center: {
					latitude: 21.0090571,
					longitude: 105.8607507
				}, 
				zoom: 16, 
				bounds : {}
			};
			console.log($scope.map.center);

		    $scope.options = {
		    	scrollwheel: false
		    };				    	

		    $scope.$watchCollection(
		    	function(){}
				,function() {$scope.nearMarkers = coor_marker;} 
				,true
			);
		}, 1500);	*/
	}

}]);





	/*var urlHouseInDistrict = API.getHousesNearby($routeParams.cityId,$routeParams.districtId);
	var latOfDistrict = "";
	var lonOfDistrict = "";

	$http.get(urlHouseInDistrict).then(function success(response){
		var house = response.data.houses;
		coor_marker = [];
		for(var i in house){
			var ret = {
				id : parseInt(i),
				latitude : house[i].lat,
				longitude : house[i].lon,
				options : {labelClass : 'marker_labels', labelContent : house[i].price}
			}
			coor_marker.push(ret);
		}

	});
	// console.log(coor_marker);
	setTimeout(function(){
	$scope.map = {
			center: {
				latitude: 21.0090571,
				longitude: 105.8607507
			}, 
			zoom: 16, 
			bounds : {}
		};
		console.log($scope.map.center);

	    $scope.options = {
	    	scrollwheel: false
	    };				    	

	    $scope.$watchCollection(
	    	function(){}
			,function() {$scope.nearMarkers = coor_marker;} 
			,true
		);
	}, 1500);	



}]);*/