angular.
	module('truliavnApp').
	config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		template: '<index></index>',
		access: {restricted: false}
	})
	.when('/houses', {
		template: '<house-list></house-list>',
		access: {restricted: false}
	})
	.when('/houses/:houseId', {
		template: '<house-detail></house-detail>',
		access: {restricted: false}
	})
	.when('/for-rent', {
		template: 'Trang này hiển thị danh sách nhà cho thuê',
		access: {restricted: false}
	})
	.when('/for-sale', {
		template: 'Trang này hiển thị danh sách nhà để bán',
		access: {restricted: false}
	})
	// house feature
	.when('/houses', {
		template: '<house-list></house-list>',
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
		controller: 'LoginController'
	})
	.when('/register', {
		templateUrl: 'view/user/register/register.html',
		controller: 'RegisterController',
		access: {restricted: false}
	})
	.when('logout', {
		controller: 'LogoutController'
	})
	.when('/:user', {
		template: 'Trang thông tin cá nhân',
		access: {restricted: true}
	})
	.when('/:user/edit', {
		template: 'Trang chỉnh sửa thông tin cá nhân',
		access: {restricted: true}
	})
	.otherwise('/');
}]);

angular.module('truliavnApp')
.run(function($rootScope, $location, $route, AuthService){
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		//user must logged in to access the route
		if (next.access.restricted && AuthService.isLoggedIn() === false) {
			$location.path('/login');
		}
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