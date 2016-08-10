angular.module('truliavnApp')
.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
        	china: true,
            v: '3.20', //defaults to latest 3.X anyhow
        	libraries: 'weather,geometry,visualization'
        });
	}
]);

app.config(['$locationProvider', '$routeProvider' ,function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider
	.when('/', {
		templateUrl: 'view/home-page/home.template.html',
		controller: 'HomeController',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	// ------------------House--------------------------------
	.when('/for-rent', {
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'ForRentCtrl',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	.when('/for-sell', {
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'ForSellCtrl',
		controllerAs: 'ctrl',
		access: {restricted: false}
	})
	.when('/for-rent/apartments',{
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'ApartmentsForRentCtrl',
		access: {restricted: false}
	})
	.when('/for-sell/apartments',{
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'ApartmentsForSellCtrl',
		access: {restricted: false}
	})
	.when('/for-rent/houses',{
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'HousesForRentCtrl',
		access: {restricted: false}
	})
	.when('/for-sell/houses',{
		templateUrl: 'view/house-list/house-list.template.html',
		controller: 'HousesForSellCtrl',
		access: {restricted: false}
	})
	.when('/need-buy', {
		templateUrl: 'view/houses/need-buy-rent.template.html',
		controller: 'HousesNeedBuyCtrl',
		access: {restricted: false}
	})
	.when('/need-rent', {
		templateUrl: 'view/houses/need-buy-rent.template.html',
		controller: 'HousesNeedRentCtrl',
		access: {restricted: false}
	})
	.when('/manage-post', {
		templateUrl: 'view/user/manage-post.template.html',
		controller: 'ManagePostCtrl',
		access: {restricted: true}
	})
	.when('/manage-post/liked', {
		templateUrl: 'view/user/manage-liked-post.template.html',
		controller: 'ManageLikedPostCtrl',
		access: {restricted: true}
	})
	// ------------------House--------------------------------
	
	// ------------------house feature------------------------
	.when('/houses', {
		template: '<house-list></house-list>',
		access: {restricted: false}
	})
	.when('/houses/:houseId', {
		template: '<house-detail></house-detail>',
		access: {restricted: false}
	})
	/*.when('/houses/:houseId', {
		templateUrl : 'view/house-detail/house-detail.template.html',
		controller : 'HouseDetailController',
		access: {restricted: false}
	})*/
	.when('/add-post-for-rent-or-sell', {
		templateUrl: 'view/user/addhouse.template.html',
		controller: 'AddPostCtrl',
		access: {restricted: true}
	})
	.when('/add-post-for-need-rent-or-buy', {
		templateUrl: 'view/user/need-buy-rent.template.html',
		controller: 'AddPostCtrl',
		access: {restricted: true}
	})
	.when('/:postId/delete', {
		controller: 'DeleteHouseCtrl',
		access: {restricted: true}
	})
	.when('/:postId/edit', {
		templateUrl: 'view/user/edithouse.template.html',
		controller: 'EditPostCtrl',
		access: {restricted : true}
	})
	// ------------------house feature------------------------

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
	.when('/:users/update', {
		templateUrl : 'view/user/update/update.html',
		controller : 'UpdateController',
		access : {restricted : true}
	})
	.when('/estimate', {
		templateUrl : 'view/estimate/estimate.template.html',
		controller : 'EstimateController',
		access: {restricted: false}
	})

	.when('/logout', {
		controller: 'LogoutController',
		access: {restricted: true}
	})
	.when('/:users', {
		templateUrl: 'view/user/user-info.template.html',
		controller: 'UserInfoCtrl',
		access: {restricted: false}
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
	.when('/filter/:content', {
		templateUrl:'view/user/house-filter.template.html', 
		controller: 'FilterHousesCtrl',
		access: {restricted: false}
	})
	.otherwise('/');
}]);

app.run(function($rootScope, $location, $route, AuthService, $cookies){
	$rootScope.$on('$routeChangeStart', function(event, next, current){

		//user must login to access the route
		AuthService.getUserStatus()
		.then(function success(){
				$rootScope.userStatus = AuthService.isLoggedIn();
				$rootScope.userName = AuthService.getUserName();
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
        var firstPassword = '#' + attrs.pwCheck;
        elem.add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
          	console.log($(firstPassword).val());
            var v = elem.val()===$(firstPassword).val();
            console.log(v);
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
}]);