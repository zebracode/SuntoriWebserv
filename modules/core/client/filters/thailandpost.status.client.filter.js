angular.module('core').filter('updateStatus',['$http', '$location', function($http, $location) {
    return function(barcode) {
        if (barcode.length < 1) {
          return "";
        }
        $http.get("/getOrderStatus?barcode=" + barcode)
        .then(function(response) {
            console.log('response', response.data);
            var status = response.data.statusDescription;
            var tpWeight = response.data.productWeight;
            var data = {"barcode": barcode, "status": status, tpWeight: tpWeight};
            $http.post("/api/update/mains", data)
            .then(function(response) {
            });
        });
        
       return "";
    };
}]);