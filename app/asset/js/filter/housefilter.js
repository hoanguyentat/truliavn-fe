app.filter('startFrom', function(){
	return function(house, start){
		start = parseInt(start);
		return house.slice(start);
	};
});


//select the house by the district, wards
app.filter('custom', function() {
  return function(input, search) {
  	// console.log(input);
    if (!input) return input;
    // console.log("Da qua buoc nay");
    if (!search) return input;
    // console.log("Da qua search buoc nay");
    var result = {};
    // console.log("search: " + search);
    angular.forEach(input, function(value, key) {
      if (input[key].districtId == search) {
      	// console.log(key, value);
        result[key] = input[key];
      }
    });
    console.log(result);
    return result;
  }
});