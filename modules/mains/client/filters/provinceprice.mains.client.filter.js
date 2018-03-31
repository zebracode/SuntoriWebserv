angular.module('mains').filter('provincePrice', function(){
    return function(basePrice, senderProvince, receiverProvince, weight){
    	var perimeter = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];
    	var addPrice1 = true;
    	var addPrice2 = true;

    	if (senderProvince === '' || receiverProvince === '') {
    		return basePrice;
    	}

    	for (var i=0; i<perimeter.length; i++) {
    		if (senderProvince === perimeter[i]) {
    			 addPrice1 = false;
    			 break;
    		}
    	}

    	for (var i=0; i<perimeter.length; i++) {
    		if (receiverProvince === perimeter[i]) {
    			 addPrice2 = false;
    			 break;
    		}
    	}

    	if (addPrice1 || addPrice2) {
			if(weight <= 1000) {
				return parseInt(basePrice) + 10;
			}
    		return parseInt(basePrice) + 20;
    	}

        return basePrice;
    };
});
