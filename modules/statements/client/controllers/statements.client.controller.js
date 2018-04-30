(function () {
  'use strict';

  // Statements controller
  angular
    .module('statements')
    .controller('StatementsController', StatementsController);

  StatementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'statementResolve'];

  function StatementsController ($scope, $state, $window, Authentication, statement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.statement = statement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Statement
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.statement.$remove($state.go('statements.list'));
      }
    }

    // Save Statement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.statement._id) {
        vm.statement.$update(successCallback, errorCallback);
      } else {
        vm.statement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('statements.view', {
          statementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
