(function () {
  'use strict';

  angular
    .module('statements')
    .controller('StatementsListController', StatementsListController);

  StatementsListController.$inject = ['StatementsService', '$location', 'Authentication', '$scope'];

  function StatementsListController(StatementsService, $location, Authentication, $scope) {

    var vm = this;

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    var isAdmin = false;

    StatementsService.query(
      function (response) {
        var userStatements = [];
        for (var i = 0; i < response.length; i++) {
          if (response[i].owner._id === Authentication.user._id) {
            userStatements.push(response[i]);
          }
        }
        setPaging(userStatements);
      }
    );


    vm.exportExcel = exportExcel;

    // Export Excel
    function exportExcel() {
      window.location.href = '/api/excel/statements';
    }

    $scope.pageChanged = function () {
      console.log('Page changed to: ' + $scope.currentPage);
      vm.statements = $scope.allPage[$scope.currentPage];
    };

    // Page rendering
    function setPaging(data) {
      var tempData = [];
      var pageData = [];
      var pageIndex = 0;
      var itemCount = 0;
      for (var i = 0; i < data.length; i++) {
        itemCount++;
        tempData.push(data[i]);
        if ((itemCount % $scope.itemsPerPage === 0) && (itemCount !== 0)) {
          pageIndex++;
          pageData[pageIndex] = tempData;
          tempData = [];
        }
        $scope.totalItems += 1;
      }

      if (tempData.length > 0) {
        pageData[pageIndex + 1] = tempData;
      }

      $scope.allPage = pageData;

      // Set first page
      // $scope.statements = pageData[1];
      vm.statements = pageData[1];
    }
  }
}());
