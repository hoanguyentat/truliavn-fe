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

//filter houses by district, wards
app.filter('houseDistrict', function() {
  return function(houses, district, ward) {
   console.log('---------------------filter');
   console.dir(houses);
   console.log(district);
   console.log('---------------------filter');
   var result = [];
   if (!houses) return houses;
   if (!district) return houses;
   else{
      if (!ward) {
         console.log("Khong co quan");
         angular.forEach(houses, function(value, key) {
            // console.log(value);
            if (value.district == district) {
              // console.log(houses[key]);
               result.push(value);
            }
         });
      } else {
         console.log("Khong co quan");
         angular.forEach(houses, function(value, key) {
            if (value.district == district && value.ward == ward) {
              // console.log(houses[key]);
               result.push(value);
            }
         });
      }
   }

   console.log(result)
   // console.log(count);
   return result;
  }
});

