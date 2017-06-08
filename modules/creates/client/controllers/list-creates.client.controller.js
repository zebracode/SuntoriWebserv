(function () {
  'use strict';

  angular
    .module('creates')
    .controller('CreatesListController', CreatesListController);

  CreatesListController.$inject = ['CreatesService'];

  function CreatesListController(CreatesService) {
    var vm = this;

    vm.creates = CreatesService.query();
  }
}());
