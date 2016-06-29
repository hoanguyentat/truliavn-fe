angular.module('truliavnApp')
.filter('filterDistrict', function(){
	return function(x, district){
		 if (x.district == district) {
		 	return x;
		 }
		 else returns;
	}
})