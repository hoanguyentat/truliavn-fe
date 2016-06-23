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
	.otherwise('/');
}]);