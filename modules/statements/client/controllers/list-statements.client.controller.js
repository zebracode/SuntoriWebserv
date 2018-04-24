(function () {
  'use strict';

  angular
    .module('statements')
    .controller('StatementsListController', StatementsListController);

  StatementsListController.$inject = ['StatementsService'];

  function StatementsListController(StatementsService) {
    var vm = this;

    vm.statements = StatementsService.query();
  }
}());
