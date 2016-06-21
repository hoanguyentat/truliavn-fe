angular.
	module('truliavnApp').
	config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		template: '<index></index>'
	})
	.when('/houses', {
		template: '<all-house></all-house>'
	})
	.when('/houses/:houseId', {
		template: '<view-house></view-house>'
	})
	.otherwise('');
}]);