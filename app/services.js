angular.module('truliavnApp')
.factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http){
	var user = null;	
	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout: logout,
		register: register
	});

	function isLoggedIn(){
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	function getUserStatus(){
		return user;
	}

	function register(email, password, address, phone, fullname){
		//creat a new instance of deferred
		var deferred = $q.defer();

		$http.post('http://localhost:3000/api/register',{email: email, password: password, address: address, phone: phone, fullname: fullname})
		//handle success
		.success(function(data, status){
			if (status == 200 && data.status) {
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

	function login(username, password){
		var deferred = $q.defer();

		$http.post('http://localhost:3000/api/login',{username: username, password: password}).success(function(data, status){
			if (status == 200 && data.status) {
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
		$http.get('/logout')
		.success(function(data){
			user = false;
			deferred.resolve();
		})
		.error(function(data){
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}
}]);