angular.module('core').filter('diffPrice', function(){
    return function(weight, basePrice, senderProvince, receiverProvince, priceList){
    	var perimeter = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];
        var price = 0;
        var charge = 0;
    	var addPrice1 = true;
    	var addPrice2 = true;
        var weightInt = parseInt(weight);

        // Check weigth is int
        if (isNaN(weightInt)) {
            return 0;
        }

        // Check has province
        if (senderProvince === '' || receiverProvince === '') {
            return 0;
        }

        if(typeof priceList === 'undefined') {
            return 0;
        }

        for(var i=0; i<priceList.length; i++) {
            if(weightInt <= parseInt(priceList[i].weight)) { 
               price =  parseInt(priceList[i].price);
               charge = parseInt(priceList[i].charge);
               break;
            }
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
    		return  basePrice - (price + charge);
    	} else {
            return basePrice - price;
        }

    };
});
