(function() {
  'use strict';

  angular
    .module('sends')
    .controller('PopupController', PopupController);

  PopupController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'Sends'];

  function PopupController($scope, $stateParams, $location, Authentication, Sends) {
    var vm = this;

    // Popup controller logic
    // ...

    $scope.authentication = Authentication;

    // Find a list of Sends
    $scope.find = function () {
      $scope.sends = Sends.query();
    };

    init();

    function init() {
    }
  }
})();
