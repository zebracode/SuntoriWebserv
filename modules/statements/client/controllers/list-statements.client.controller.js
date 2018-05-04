(function () {
  'use strict';

  angular
    .module('statements')
    .controller('StatementsListController', StatementsListController);

  StatementsListController.$inject = ['StatementsService', '$location'];

  function StatementsListController(StatementsService, $location) {
    var vm = this;

    vm.statements = StatementsService.query();
    vm.exportExcel = exportExcel;

    // Export Excel
    function exportExcel() {
      console.log("Export Excel ...");
      window.location.href = '/api/excel/statements'
    }

  }
}());
