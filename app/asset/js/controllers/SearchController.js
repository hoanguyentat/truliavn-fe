app.controller('SearchController', ['$scope', '$http', function($scope, $http){

	$scope.search = function(){
		$http.post('http://ngocdon.me:3000/api/search', {search: $scope.searchContent})
		.then(function(res){
			console.log(res);
		});
	};
}]);