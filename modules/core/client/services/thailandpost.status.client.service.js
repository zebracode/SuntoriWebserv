angular.module('core').factory('thailandPostStatus', function($http, $q) {

  //  Create a class that represents our name service.
  function NameService() {

    var self = this;

    //  getName returns a promise which when 
    //  fulfilled returns the name.
    self.getStatus = function(barcode) {
      return $http.get('/getOrderStatus?barcode=' + barcode);
    };
  }

  return new NameService();
});

