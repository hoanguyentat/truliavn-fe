var app = angular.module('truliavnApp', [
	'houseList',
	'homePage',
	'houseDetail',
	'ngRoute',
	'ngCookies',
	'matchPassword'

]);

app.filter('startFrom', function(){
	return function(house, start){
		start = parseInt(start);
		// console.log(house);
		return house.slice(start);
	};
});