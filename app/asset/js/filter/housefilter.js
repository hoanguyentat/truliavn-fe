app.filter('startFrom', function(){
	return function(house, start){
		start = parseInt(start);
		return house.slice(start);
	};
});


//select the house by the district, wards
app.filter('customDistrict', function() {
  return function(input, search) {
  	// console.dir(input);
    if (!input) return input;
    if (!search) return input;
    var result = {};
    angular.forEach(input, function(value, key) {
      if (input[key].districtId == search) {
        result[key] = input[key];
      }
    });
    // console.log(result);
    return result;
  }
});

app.filter('houseDistrict', function() {
  return function(houses, district) {
    // console.dir(houses);
    // console.log(district);
    if (!houses) return houses;
    if (!district) return houses;
    var result = {};
    var count = 0;
    angular.forEach(houses, function(value, key) {
      if (houses[key].district == district) {
        // console.log(houses[key]);
        result[key] = houses[key];
        ++count;
      }
    });
    // console.log(count);
    return result;
  }
});

