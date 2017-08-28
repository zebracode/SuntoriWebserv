'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', '$mdDialog',
  function ($scope, $filter, Admin, $mdDialog) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 10;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

    $scope.showTopUpPromt = function(event) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('เติมเงิน')
          .textContent('ระบุจำนวนเงินที่ต้องการเติม')
          .placeholder('จำนวนเงิน')
          .ariaLabel('')
          .initialValue('')
          .targetEvent(event)
          .ok('ตกลง')
          .cancel('ยกเลิก');

          $mdDialog.show(confirm).then(function(result) {
            $scope.status = 'You decided to name your dog ' + result + '.';
          }, function() {
            $scope.status = 'You didn\'t name your dog.';
          });
        }
  }
]);
