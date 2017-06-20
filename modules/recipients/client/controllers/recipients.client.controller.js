    'use strict';

// Recipients controller
angular.module('recipients').controller('RecipientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipients',
  function ($scope, $stateParams, $location, Authentication, Recipients) {
    $scope.authentication = Authentication;

    // Create new Recipient
    $scope.create = function () {
      // Create new Recipient object
      var recipient = new Recipients({
        name: this.name,
        tel: this.tel,
        address: this.address,
        country: this.country,
        postcode: this.postcode
      });

      // Redirect after save
      recipient.$save(function (response) {
        $location.path('recipients');

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

    // Remove existing Recipient
    $scope.remove = function (recipient) {
      if (recipient) {
        recipient.$remove();

        for (var i in $scope.recipients) {
          if ($scope.recipients[i] === recipient) {
            $scope.recipients.splice(i, 1);
          }
        }
      } else {
        $scope.recipient.$remove(function () {
          $location.path('recipients');
        });
      }
    };

    // Update existing Recipient
    $scope.update = function () {
      var recipient = $scope.recipient;

      recipient.$update(function () {
        $location.path('recipients');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Recipients
    $scope.find = function () {
      $scope.recipients = Recipients.query();
    };

    // Find existing Recipient
    $scope.findOne = function () {
      $scope.recipient = Recipients.get({
        recipientId: $stateParams.recipientId
      });
    };
  }
]);
