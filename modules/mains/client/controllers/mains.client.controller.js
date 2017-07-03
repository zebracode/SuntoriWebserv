'use strict';

// Mains controller
angular.module('mains').controller('MainsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mains',
  function ($scope, $stateParams, $location, Authentication, Mains) {
    $scope.authentication = Authentication;

    // Create new Main
    $scope.create = function () {
      // Create new Main object
      var main = new Mains({
        s_name: this.s_name,
        s_tel: this.s_tel,
        s_address: this.s_address,
        s_country: this.s_country,
        s_postcode: this.s_postcode,
        r_name: this.r_name,
        r_tel: this.r_tel,
        r_address: this.r_address,
        r_country: this.r_country,
        r_postcode: this.r_postcode,
        order: this.order,
        invoice: this.invoice,
        price: this.price,
        weight: this.weight,
        detail: this.detail,
        barcode: this.barcode
      });

      // Redirect after save
      main.$save(function (response) {
        $location.path('mains/create');

        // Clear form fields
//        $scope.s_name = '';
//        $scope.s_tel = '';
//        $scope.s_address = '';
//        $scope.s_country = '';
//        $scope.s_postcode = '';
        $scope.r_name = '';
        $scope.r_tel = '';
        $scope.r_address = '';
        $scope.r_country = '';
        $scope.r_postcode = '';
        $scope.order = '';
        $scope.invoice = '';
        $scope.price = '';
        $scope.weight = '';
        $scope.detail = '';
        $scope.barcode = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Main
    $scope.remove = function (main) {
      if (main) {
        main.$remove();

        for (var i in $scope.mains) {
          if ($scope.mains[i] === main) {
            $scope.mains.splice(i, 1);
          }
        }
      } else {
        $scope.main.$remove(function () {
          $location.path('mains');
        });
      }
    };

    // Update existing Main
    $scope.update = function () {
      var main = $scope.main;

      main.$update(function () {
        $location.path('mains');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Mains
    $scope.find = function () {
      $scope.mains = Mains.query();
    };

    // Find existing Main
    $scope.findOne = function () {
      $scope.main = Mains.get({
        mainId: $stateParams.mainId
      });
    };
  }
]);
