app.controller('ManagePostCtrl', ['$scope', 'API', '$cookies', '$http', function($scope, API, $cookies, $http){
	var urlPost = API.getUserPost($cookies.get('user.id'));
	var listPost = this;
	listPost.currentPage = 0;
	listPost.pageSize = 20;
	console.log(urlPost);
	$http.get(urlPost).then(function(res){
		listPost.houses = res.data.houses;
		console.log(listPost.houses);
		listPost.numberOfPages = function(){
			return Math.ceil(listPost.houses.length/listPost.pageSize); 
		};
	});
}]);