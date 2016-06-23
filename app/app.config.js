angular.
	module('truliavnApp').
	config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		template: '<index></index>'
	})
	.when('/login', {
		templateUrl: 'view/user/login/login.html',
		controller: 'LoginController'
	})
	.when('/register', {
		templateUrl: 'view/user/register/register.html',
		controller: 'RegisterController'
	})
	.when('logout', {
		controller: 'LogoutController'
	})
	.when('/houses', {
		template: '<house-list></house-list>'
	})
	.when('/houses/:houseId', {
		template: '<house-detail></house-detail>'
	})
	.otherwise('/');
}]);