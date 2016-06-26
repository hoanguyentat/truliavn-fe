angular.
	module('truliavnApp').
	config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		template: '<index></index>'
	})
	.when('/houses', {
		template: '<house-list></house-list>'
	})
	.when('/houses/:houseId', {
		template: '<house-detail></house-detail>'
	})
	.when('/for-rent', {
		template: '<house-list></house-list>'
	})
	.when('/for-sale', {
		template: '<house-list></house-list>'
	})
	// house feature
	.when('/houses', {
		template: '<house-list></house-list>'
	})
	.when('/addhouse', {
		template: '<house-list></house-list>'
	})
	.when('/:postId/delete', {
		template: '<house-list></house-list>'
	})
	.when('/:postId/edit', {
		template: '<house-list></house-list>'
	})
	// user feature
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
	.when('/:user/edit', {
		template: '<house-list></house-list>'
	})
	
	.otherwise('/');
}]);