var app = angular.module('truliavnApp', [
	'houseList',
	'houseDetail',
	'ngRoute',
	'ngCookies',
	'matchPassword',
	'uiGmapgoogle-maps'

]);

app.filter('startFrom', function(){
	return function(house, start){
		start = parseInt(start);
		// console.log(house);
		return house.slice(start);
	};
});