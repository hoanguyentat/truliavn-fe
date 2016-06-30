
//Handling user authentication service
app.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
	var user = null;
	var token = "";
	var emailUser = "";
	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		getUserToken: getUserToken,
		getUserEmail: getUserEmail,
		login: login,
		logout: logout,
		register: register,
		hostName: 'http://localhost:3000'
	});

	function isLoggedIn(){
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	function getUserStatus(){
		return $http.get('http://localhost:3000/api/userstatus')
		.success(function(data){
			console.log(data);
			if (data.status) {
				user = true;
			} else {
				user = false;
			}
		})
		.error(function(data) {
			user = false;
		});
	}

	//return a token + email to user can use to add a new post
	function getUserToken(){
		return token;
	}
	function getUserEmail(){
		return emailUser;
	}

	function register(email, password, repeatPassword, address, phone, fullname){
		//creat a new instance of deferred
		var deferred = $q.defer();

		$http.post('http://localhost:3000/api/register',{email: email, password: password, repeatPassword: repeatPassword, address: address, phone: phone, fullname: fullname})
		//handle success
		.success(function(data, status){
			if (status == 200 && data.status) {
				deferred.resolve();
				console.log(data, status);
			} else{
				deferred.reject();
			}
		})
		//handle error
		.error(function(data){
			console.log(data);
			deferred.reject();
		});
		return deferred.promise;
	}	

	function login(email, password){
		var deferred = $q.defer();

		$http.post('http://localhost:3000/api/login',{email: email, password: password}).success(function(data, status){
			if (status == 200 && data.status =="success") {
				$http.get('http://localhost:3000/api/user/edit').then(function(response){
					console.log(response);
				});
				console.log(data);
				token = data.user.token;
				emailUser = data.user.email;
				user = true;
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
		$http.post('http://localhost:3000/api/logout', {email: emailUser, token: token})
		.success(function(data){
			console.log("Logout thanh cong");
			user = false;
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
	return ({
		addHouse: addHouse,
		editHouse: editHouse,
		deleteHouse: deleteHouse,	
	});

	function addHouse(email, token, type, address, area, houseFor, noOfBedrooms, noOfBathrooms, noOfFloors, interior, buildIn, price, feePeriod, city, district, ward, description){
		var houseData = {
			email: email,
			token: token,
			type: type,
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
			description: description
		};
		var deferred = $q.defer();

		//sent request add house
		$http.post('http://localhost:3000/api/house', houseData)
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

	function editHouse(email, token, type, address, area, houseFor, noOfBedrooms, noOfBathrooms, noOfFloors, interior, buildIn, price, feePeriod, city, district, ward, description, houseId){
		var houseData = {
			email: email,
			token: token,
			type: type,
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
		$http.post('http://localhost:3000/api/house/edit', houseData)
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

		$http.post('http://localhost:3000/api/house/delete', {email: email, token: token, houseId: houseId})
		.success(function(response){
			console.log("Xoa nha thanh cong");
			deferred.resolve();
		})
	}
}]);