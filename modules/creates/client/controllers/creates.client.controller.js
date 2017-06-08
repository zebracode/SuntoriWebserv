(function () {
  'use strict';

  // Creates controller
  angular
    .module('creates')
    .controller('CreatesController', CreatesController);

  CreatesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'createResolve'];

  function CreatesController ($scope, $state, $window, Authentication, create) {
    var vm = this;

    vm.authentication = Authentication;
    vm.create = create;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Create
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.create.$remove($state.go('creates.list'));
      }
    }

    // Save Create
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.createForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.create._id) {
        vm.create.$update(successCallback, errorCallback);
      } else {
        vm.create.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('creates.view', {
          createId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
