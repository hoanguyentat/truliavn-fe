
//Handling user authentication service
app.factory('AuthService', ['$q', '$timeout', '$rootScope', '$http', '$cookies', function($q, $timeout, $rootScope, $http, $cookies){
	var user = null;
	var emailUser;
	var token;
	var userId = "";
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
		userId = $cookies.get('user.id');
		console.log($http.get('http://localhost:3000/api/user'));
		if (userId == null) {
			return $http.get('http://localhost:3000/api/user').success(function(){user = false;}).error(function(){user = false;});
		} else{		
			console.log(userId);
			return $http.get('http://localhost:3000/api/user/' + userId)
			.success(function(data){
				console.log("Trang thai user: ", data,'\n...................');
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
			if (status == 200 && data.status == 'success') {
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
			console.log(data);
			if (status == 200 && data.status =="success") {
				$http.get('http://localhost:3000/api/user/' + data.user.id).then(function(response){
					console.log(response);
				});
				$cookies.put('user.id', data.user.id);
				token = data.user.token;
				emailUser = data.user.email;
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
		$http.post('http://localhost:3000/api/logout', {email: emailUser, token: token})
		.success(function(data){
			console.log("Logout thanh cong");
			user = false;
			$cookies.remove('user.id');
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

app.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});