angular.module('houseList')
.component('houseList', {
	templateUrl: 'view/house-list/house-list.template.html',
	controller:['$http', 'AuthService', 'API', function($http, AuthService, API){

		var url = API.getHouses();
		var list = this;
		// list.currentPage = 1;
		// list.pageSize = 20;
		list.currentPage = 0;
		list.pageSize = 20;
		list.maxSize = 5; //Number of pager buttons to show

		list.setPage = function (pageNo) {
		list.currentPage = pageNo;
		};

		list.pageChanged = function() {
		console.log('Page changed to: ' + list.currentPage);
		};

		list.setItemsPerPage = function(num) {
		  list.pageSize = num;
		  list.currentPage = 1; //reset to first page
		}

		$http.get(url).then(function success(response){
			list.houses = response.data.houses;
			// console.log(list.houses);
			list.noOfPages = list.houses.length;
			// console.log(list.noOfPages);
			angular.forEach(list.houses, function(val, key){
				val.description = val.description.slice(0, 150) + '....';
			});
		});
	}],
	controllerAs: 'ctrl'
});	