angular.module('core').filter('updateStatus',['$http', '$location', function($http, $location) {
    return function(barcode) {
        if (barcode.length < 1) {
          return "";
        }
        $http.get("/getOrderStatus?barcode=" + barcode)
        .then(function(response) {
            var status = response.data;
            var data = {"barcode": barcode, "status": status};
            $http.post("/api/update/mains", data)
            .then(function(response) {
            });
        });
        
       return "";
    };
}]);