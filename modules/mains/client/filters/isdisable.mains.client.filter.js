angular.module('mains').filter('isDisabled', function(){
    return function(amount){
        if (amount < 0) {
            return "disabled";
        }
        return "";
    };
});

