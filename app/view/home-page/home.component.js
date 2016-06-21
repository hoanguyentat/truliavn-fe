angular.module('homePage')
.component('index', {
	templateUrl: 'view/home-page/home.template.html',
	controller: ['$http', function HomePageController($http){
		$http.get('../../data/houses.json').then(function success(response){
			var selfHome = this;
			selfHome.home = response.data[0];
		});
	}],
	bindings: {
    house: '='
	}
});