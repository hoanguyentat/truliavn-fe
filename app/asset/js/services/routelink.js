app.config(['$routeProvider',function($routeProvider) {
	$routeProvider.
	when('/', {
			templateUrl: 'view/user/index.html',
			controller: 'HomeCtrl'
		})
	.when('/addhouse', {
		templateUrl: 'view/user/addhouse.html',
		controller: 'AddHouseCtrl'
	})
	.when('/view-house/:house_id?', {
		controller: 'ViewHouseCtrl',
		templateUrl: 'view-house.html'
	})
	.otherwise({redirectTo: '/'})
}])