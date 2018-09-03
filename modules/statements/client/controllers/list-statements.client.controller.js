(function () {
  'use strict';

  angular
    .module('statements')
    .controller('StatementsListController', StatementsListController);

  StatementsListController.$inject = ['StatementsService', '$location', 'Authentication', '$scope', '$http'];

  function StatementsListController(StatementsService, $location, Authentication, $scope, $http) {

    var vm = this;

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    // Default data from and date to
    var toDay = new Date();
    $scope.startDate = new Date(toDay.getFullYear(), toDay.getMonth(), 1);
    $scope.endDate = new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0);

    var isAdmin = false;

    $scope.find = function () {
      $http({
        method: "GET",
        url: "/api/findStatements?ownerId=" + Authentication.user._id
          + "&startDate=" + $scope.startDate
          + "&endDate=" + $scope.endDate
      }).then(function mySuccess(response) {
        setPaging(response.data);
      }, function myError(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    vm.exportExcel = exportExcel;

    // Export Excel
    function exportExcel() {
      window.location.href = '/api/excel/statements';
    }

    $scope.pageChanged = function () {
      console.log('Page changed to: ' + $scope.currentPage);
      vm.statements = $scope.allPage[$scope.currentPage];
    };

    // Set to Today
    $scope.todaySet = function () {
      $scope.startDate = new Date();
      $scope.startDate.setHours(0, 0, 0, 0);
      $scope.endDate = new Date();
      $scope.find();
    };

    // When change start date
    $scope.startDateChanged = function () {
      $scope.find();
    };

    // When change end date
    $scope.endDateChanged = function () {
      $scope.find();
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
      vm.statements = pageData[1];
    }
  }
}());
