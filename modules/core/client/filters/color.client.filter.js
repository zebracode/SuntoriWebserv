angular.module('core').filter('color', function(){
    return function(weight, basePrice, senderProvince, receiverProvince, priceList){
    	var perimeter = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร'];
        var price = 0;
        var charge = 0;
    	var addPrice1 = true;
    	var addPrice2 = true;
        var weightInt = parseInt(weight);

        // Check weigth is int
        if (isNaN(weightInt)) {
            return "";
        }

        // Check has province
        if (senderProvince === '' || receiverProvince === '') {
            return "";
        }

        if(typeof priceList === 'undefined') {
            return "";
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
            if((basePrice - (price + charge)) < 0) {
                return  "text-danger";
            } 
            return "text-success";
    		
    	} else {
            if((basePrice - price) < 0) {
                return  "text-danger";
            } 
            return "text-success";
        }

    };
});
