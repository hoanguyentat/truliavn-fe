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
app.filter('customCity', function() {
  return function(input, search) {
    // console.dir(input);
    if (!input) return input;
    if (!search) return input;
    var result = {};
    angular.forEach(input, function(value, key) {
      if (input[key].cityId == search) {
        result[key] = input[key];
      }
    });
    // console.log(result);
    return result;
  }
});

//filter houses by district, wards
app.filter('houseDistrict', function() {
  return function(houses, district, ward, area, price) {
   var areaArr = [
      [],
      [0, 30],
      [30, 50],
      [50, 80],
      [80, 100],
      [100, 150],
      [150, 200],
      [200, 250],
      [250, 300],
      [300, 500],
      [500, 10000]
   ];

   var priceArr = [
      [],
      [0, 1], 
      [1, 3], 
      [3, 5],
      [5, 10],
      [10, 40],
      [40, 70],
      [70, 100],
      [100, 100000]
   ];
   var result = [];
   if (!houses) return houses;
   if (!district) return houses;
   else{
      if (!ward) {
         if (!area && !price) {
            console.log("Hehe hehe 1");
            angular.forEach(houses, function(value, key) {
               if (value.district == district) {
                  result.push(value);
               }
            });
         }
         if (!area && price) {
            console.log("Hehe hehe 2");
            angular.forEach(houses, function(value, key) {
               if (value.district == district && priceArr[price][0] < value.price && value.price < priceArr[price][1]) {
                  result.push(value);
               }
            });
         }
         if (area && !price) {
            console.log("Hehe hehe 3");
            angular.forEach(houses, function(value, key) {
               if (value.district == district && areaArr[area][0] < value.area && value.area < areaArr[area][1]) {
                  result.push(value);
               }
            });
         }
         if (area && price) {
            console.log("Hehe hehe 4");
            angular.forEach(houses, function(value, key) {
               if (value.district == district && priceArr[price][0] < value.price && value.price < priceArr[price][1] && areaArr[area][0] < value.area && value.area < areaArr[area][1]) {
                  result.push(value);
               }
            });
         }
      } else {
         angular.forEach(houses, function(value, key) {
            if (value.district == district && value.ward == ward) {
               console.log("------ward------");
              console.log(houses[key]);
              console.log("------ward------");
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

