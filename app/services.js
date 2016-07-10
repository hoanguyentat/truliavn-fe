
//Handling user authentication service
app.factory('AuthService', ['$q', '$timeout', '$rootScope', '$http', '$cookies', function($q, $timeout, $rootScope, $http, $cookies){
	var user = null;
	var userName;
	var userId = "";
	var host = 'http://truliavn.sunkhoai.com:3000';
	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		getUserName: getUserName,
		getUserToken: getUserToken,
		getUserEmail: getUserEmail,
		login: login,
		logout: logout,
		register: register,
		update : update,
		hostName: 'http://truliavn.sunkhoai.com:3000'
	});

	function isLoggedIn(){
		if (user) {
			return true;
		} else {
			return false;
		}
	}
// return status user to check user logged in


	function getUserName(){
		userName = $cookies.get('userName');
		return userName;
	}
	function getUserStatus(){
		userId = $cookies.get('user.id');
		if (userId == null) {
			return $http.get(host +'/api/user').success(function(){
				user = false;
			})
			.error(function(){
				user = false;
			});
		} else{
			return $http.get(host +'/api/user/' + userId)
			.success(function(data){

				if (data.user.status) {
					user = true;
				} else {
					user = false;
				}
			})
			.error(function(data) {
				user = false;
			});
		}
	}

	//return a token + email to user can use to add a new post
	function getUserToken(){
		return $cookies.get('user.token');
	}
	function getUserEmail(){
		return $cookies.get('user.email');
	}

	function register(email, password, repeatPassword, address, phone, fullname){
		//creat a new instance of deferred
		var deferred = $q.defer();

		$http.post(host +'/api/register',{email: email, password: password, repeatPassword: repeatPassword, address: address, phone: phone, fullname: fullname})
		//handle success
		.success(function(data, status){
			if (status == 200 && data.status == 'success') {
				deferred.resolve();
			} else{
				deferred.reject();
			}
		})
		//handle error
		.error(function(data){
			deferred.reject();
		});
		return deferred.promise;
	}

	function update(id,fullname, phone, address, oldPassword, newPassword, repeatPassword){
		var deferred = $q.defer();

		$http.post(host +'/api/user/edit', {id : id,
													fullname : fullname, 
													phone : phone, 
													address : address,
													oldPassword : oldPassword,
													newPassword : newPassword,
													repeatPassword : repeatPassword})
		.success(function(data, status){
			if(status == 200 && data.status == 'success'){
				deferred.resolve();
			}
			else {
				deferred.reject();
			}
		})
		.error(function(data){
			deferred.reject();
		});
		return deferred.promise;
	}
	function login(email, password){
		var deferred = $q.defer();
		$http.post(host +'/api/login',{email: email, password: password}).success(function(data, status){
			if (status == 200 && data.status =="success") {

				//put userId to cookies
				console.log(data.user);
				$cookies.put('userName', data.user.fullname);
				$cookies.put('user.id', data.user.id);
				$cookies.put('user.email', data.user.email);
				$cookies.put('user.token', data.user.token);
				user = true;
				// $cookieStore.put('globals', $rootScope.globals);

				deferred.resolve();
			} else{
				user = false;
				deferred.reject();
			}
		})
		.error(function(data){
			user = false;
			deferred.reject();
		});
		return deferred.promise;
	}

	function logout(){
		var deferred = $q.defer();

		//sent request logout
		$http.post(host +'/api/logout', {email: $cookies.get('user.email'), token: $cookies.get('user.token')})
		.success(function(data){
			console.log("Logout thanh cong");
			user = false;
			$cookies.remove('user.id');
			$cookies.remove('user.token');
			$cookies.remove('user.email');
			deferred.resolve();
		})
		.error(function(data){
			user = false;
			console.log("Logout khong thanh cong");
			deferred.reject();
		});

		return deferred.promise;
	}
}]);

//House feature service
app.factory('HouseService', ['$q', '$http', '$timeout', function($q, $http, $timeout){
	var host = 'http://ngocdon.me:3000';
	return ({
		addHouse: addHouse,
		editHouse: editHouse,
		deleteHouse: deleteHouse,
	});

	function addHouse(email, token, type, title, address, area, houseFor, noOfBedrooms, noOfBathrooms, noOfFloors, interior, buildIn, price, feePeriod, city, district, ward, images, description){
		var houseData = {
			email: email,
			token: token,
			type: type,
			title: title,
			address: address,
			area: area,
			houseFor: houseFor,
			noOfBathrooms: noOfBathrooms,
			noOfBedrooms: noOfBedrooms,
			noOfFloors: noOfFloors,
			interior: interior,
			buildIn: buildIn,
			price: price,
			feePeriod: feePeriod,
			city: city,
			district: district,
			ward: ward,
			images: images,
			description: description
		};
		var deferred = $q.defer();

		//sent request add house
		$http.post(host +'/api/house', houseData)
		.success(function(data){
			console.log("Them nha thanh cong");
			deferred.resolve();
		})
		.error(function(data){
			console.log("Them nha khong thanh cong");
			deferred.reject();
		});

		return deferred.promise;
	}

	function editHouse(email, token, type, title, address, area, houseFor, noOfBedrooms, noOfBathrooms, noOfFloors, interior, buildIn, price, feePeriod, city, district, ward, description, houseId){
		var houseData = {
			email: email,
			token: token,
			type: type,
			title: title,
			address: address,
			area: area,
			houseFor: houseFor,
			noOfBathrooms: noOfBathrooms,
			noOfBedrooms: noOfBedrooms,
			noOfFloors: noOfFloors,
			interior: interior,
			buildIn: buildIn,
			price: price,
			feePeriod: feePeriod,
			city: city,
			district: district,
			ward: ward,
			description: description,
			houseId: houseId
		};
		var deferred = $q.defer();

		//sent request add house
		$http.post(host +'/api/house/edit', houseData)
		.success(function(data){
			console.log("Sua nha thanh cong");
			deferred.resolve();
		})
		.error(function(data){
			console.log("Sua nha khong thanh cong");
			deferred.reject();
		});

		return deferred.promise;
	}

	function deleteHouse(email, houseId, token){
		var deferred = $q.defer();

		$http.post(host +'/api/house/delete', {email: email, token: token, houseId: houseId})
		.success(function(response){
			console.log("Xoa nha thanh cong");
			deferred.resolve();
		})
	}
}]);

app.factory('API', ['AuthService',function(AuthService){
	return ({
		getHouses: getHouses,
		getUserInfo: getUserInfo,
		getHouseDetail: getHouseDetail,
		getHousesNearby: getHousesNearby,
		getDistanceNearBy : getDistanceNearBy,
		getHousesForRent: getHousesForRent,
		getHousesForSell: getHousesForSell,
		getServicesNearBy: getServicesNearBy,
		getHousesIn: getHousesIn,
		getUserPost: getUserPost
	});

	function getUserInfo(id){
		return AuthService.hostName + '/api/user/' + id;
	}
	function getHouses(){
		return AuthService.hostName + '/api/houses?specific=1&raw=1';
	}
	function getHouseDetail(id){
		return AuthService.hostName + '/api/house/' + id + '?raw=1';
	}


	function getHousesNearby(city, district, ward){
		return AuthService.hostName + '/api/houses?city=' + city  + '&district=' + district + '&ward=' + ward +'&specific=1';
	}

	function getDistanceNearBy(){
		return AuthService.hostName + '/api/distance';
	}

	function getHousesForRent(){
		return AuthService.hostName + '/api/houses?housefor=rent&raw=1&specific=1';
	}

	function getHousesForSell(){
		return AuthService.hostName + '/api/houses?housefor=sell&raw=1&specific=1';
	}

	function getServicesNearBy(){
		return AuthService.hostName + '/api/nearby';
	}

	function getHousesIn(place, id){
		return AuthService.hostName + '/api/houses' + '?' + place + '=' + id;
	}

	function getUserPost(id){
		return AuthService.hostName + '/api/houses?owner=' + id;
	}
}]);
