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
        $location.path('sends');

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
        $location.path('sends');
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

// PopupCreateController
angular.module('sends').controller('PopupController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Sends, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

// Popup Create Send
    $scope.animationsEnabled = true;

    $scope.CreateOpen = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/sends/views/create-send.client.view.html',
        controller: 'PopupController',
        size: size,
        resolve: {
          send: function () {
            return $scope.send;
          }
        }
      });

    modalInstance.result.then(function (send) {
          $scope.send = send;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

    $scope.ok = function (response) {
                $uibModalStack.dismissAll($scope.create);
                setTimeout(function() {
                      // Do something after 1 seconds
                      location.reload();//reload page
                }, 1000);
            };

        $scope.cancel = function () {
            $uibModalStack.dismissAll();
          };
      }
]);

// PopupEditController
angular.module('sends').controller('PopupEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Sends, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

    // Find a list of Sends
    $scope.findOne = function () {
        Messages.query({
            username: $routeParams.username
        }).$promise.then(function (response) {
            $scope.messages = response;
            console.log($scope.messages);
        });

    };

// Popup Create Send
    $scope.animationsEnabled = true;

    $scope.EditOpen = function (size, selectedSend) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/sends/views/edit-send.client.view.html',
        controller: function ($scope, $uibModalInstance, send) {
            $scope.send = send;
        },
        size: size,
        resolve: {
                send: function () {
                  return selectedSend;
                }
              }
            });

    modalInstance.result.then(function (send) {
          $scope.selected = selectedSend;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
      };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

    $scope.ok = function (response) {
                $uibModalStack.dismissAll('closing');
                setTimeout(function() {
                      // Do something after 1 seconds
                      location.reload();//reload page
                }, 1000);
            };

        $scope.cancel = function () {
            $uibModalStack.dismissAll('closing');
          };
      }
]);


// PaginationCtrl

angular.module('sends').controller('PaginationCtrl', ['$scope', '$stateParams', '$location', 'Authentication', 'Sends','$log', '$uibModal', '$uibModalStack',

  function ($scope, $stateParams, $location, Authentication, Sends, $log, $uibModal, $uibModalStack) {

    $scope.authentication = Authentication;

    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
}]);
