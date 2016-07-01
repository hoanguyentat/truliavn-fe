
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
		update : update
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

	//return a token + email to user can use to add a new post
	function getUserToken(){
		return token;
	}
	function getUserEmail(){
		return emailUser;
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

	function update(fullname, phone, address, oldPassword, newPassword, repeatPassword){
		var deferred = $q.defer();
		$http.post('http://localhost:3000/api/user/edit', {fullname : fullname, 
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

		$http.post('http://localhost:3000/api/login',{email: email, password: password}).success(function(data, status){
			if (status == 200 && data.status =="success") {
				console.log(data);
				token = data.user.token;
				emailUser = data.user.email;
				// user = true;
				user = {};
				user.email = data.user.email;
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
			console.log("Thanh cmn cong");
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

//House feature service