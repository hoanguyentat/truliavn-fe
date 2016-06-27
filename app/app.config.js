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
		templateUrl: 'view/user/addhouse.template.html',
		controller: 'AddHouseCtrl'
	})
	.when('/:postId/delete', {
		controller: 'DeleteHouseCtrl'
	})
	.when('/:postId/edit', {
		templateUrl: 'view/user/edithouse.template.html',
		controller: 'EditHouseCtrl'
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
	.when('/:user', {
		template: 'Trang thông tin cá nhân'
	})
	.when('/:user/edit', {
		template: 'Trang chỉnh sửa thông tin cá nhân'
	})
	
	.otherwise('/');
}]);