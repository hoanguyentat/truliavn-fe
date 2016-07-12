app.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            v: '3.20', //defaults to latest 3.X anyhow
        	libraries: 'weather,geometry,visualization'
        });
	}
]);
angular.
module('truliavnApp')
.config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'view/home-page/home.template.html',
		controller: 'HomeController',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	.when('/for-rent', {
		templateUrl: 'view/houses/house-for-rent.template.html',
		controller: 'HouseForRentCtrl',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	.when('/for-sell', {
		templateUrl: 'view/houses/house-for-sell.template.html',
		controller: 'HouseForSellCtrl',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	.when('/manage-post', {
		templateUrl: 'view/user/manage-post.template.html',
		controller: 'ManagePostCtrl',
		access: {restricted: true}
	})
	
	// house feature
	.when('/houses', {
		template: '<house-list></house-list>',
		access: {restricted: false}
	})
	.when('/houses/:houseId', {
		template: '<house-detail></house-detail>',
		access: {restricted: false}
	})
	.when('/addhouse', {
		templateUrl: 'view/user/addhouse.template.html',
		controller: 'AddHouseCtrl',
		access: {restricted: true}
	})
	.when('/:postId/delete', {
		controller: 'DeleteHouseCtrl',
		access: {restricted: true}
	})
	.when('/:postId/edit', {
		templateUrl: 'view/user/edithouse.template.html',
		controller: 'EditHouseCtrl',
		access: {restricted : true}
	})
	// user feature
	.when('/login', {
		templateUrl: 'view/user/login/login.html',
		controller: 'LoginController',
		access: {restricted: false}
	})
	.when('/register', {
		templateUrl: 'view/user/register/register.html',
		controller: 'RegisterController',
		access: {restricted: false}
	})
	.when('/update', {
		templateUrl : 'view/user/update/update.html',
		controller : 'UpdateController',
		access : {restricted : true}
	})
	.when('logout', {
		controller: 'LogoutController',
		access: {restricted: true}
	})
	.when('/:user', {
		template: 'Trang thông tin cá nhân',
		access: {restricted: true}
	})
	.when('/:user/edit', {
		template: 'Trang chỉnh sửa thông tin cá nhân',
		access: {restricted: true}
	})
	.when('/search/:searchContent', {
		templateUrl: 'view/user/search-result.template.html',
		controller: 'SearchController',
		access: {restricted: false}
	})
	.when('/:content', {
		templateUrl:'view/user/house-filter.template.html'
	})
	.otherwise('/');
}]);

angular.module('truliavnApp')
.run(function($rootScope, $location, $route, AuthService){

	// console.log($rootScope.userStatus);
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		//user must login to access the route

		AuthService.getUserStatus()
		.then(function success(){
				$rootScope.userStatus = AuthService.isLoggedIn();
				$rootScope.userName = AuthService.getUserName();
				// console.log($rootScope.userStatus);
			if (next.access.restricted && !AuthService.isLoggedIn()) {
				$location.path('/login');
				$route.reload();
			}
		});
	});
});

angular.module('matchPassword', [])
.directive('pwCheck', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
      	console.log(attrs.pwCheck);
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            console.log(v);
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
}]);