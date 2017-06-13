'use strict';

// Sends controller
angular.module('sends').controller('SendsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends',

  function ($scope, $stateParams, $location, Authentication, Sends) {
    $scope.authentication = Authentication;



    // Create new Send
    $scope.create = function () {
      // Create new Send object
      var send = new Sends({
        name: this.name,
        tel: this.tel,
        address: this.address,
        country: this.country,
        postcode: this.postcode
      });

      // Redirect after save
      send.$save(function (response) {
        $location.path('sends/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.tel = '';
        $scope.address = '';
        $scope.country = '';
        $scope.postcode = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Send
    $scope.remove = function (send) {
      if (send) {
        send.$remove();

        for (var i in $scope.sends) {
          if ($scope.sends[i] === send) {
            $scope.sends.splice(i, 1);
          }
        }
      } else {
        $scope.send.$remove(function () {
          $location.path('sends');
        });
      }
    };

    // Update existing Send
    $scope.update = function () {
      var send = $scope.send;

      send.$update(function () {
        $location.path('sends/' + send._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Sends
    $scope.find = function () {
      $scope.sends = Sends.query();
    };

    // Find existing Send
    $scope.findOne = function () {
      $scope.send = Sends.get({
        sendId: $stateParams.sendId
      });
    };
  }

]);
