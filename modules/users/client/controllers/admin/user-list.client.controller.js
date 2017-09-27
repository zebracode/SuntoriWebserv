'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', '$mdDialog', '$http',
  function ($scope, $filter, Admin, $mdDialog, $http) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 5;
      $scope.currentPage = 1;
      $scope.pageSize = 10;

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

    $scope.showTopUpPromt = function(event, user, index) {
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
            $scope.updateBalance(user, index, result);
          }, function() {
            $scope.status = 'You didn\'t name your dog.';
        });
    };
    
    $scope.updateBalance = function (user, index, amt) {
      var balanceAmt = parseInt($scope.pagedItems[index].balanceAmt);
      console.log(balanceAmt);
      if (balanceAmt > 0){
        console.log("if");
        balanceAmt += parseInt(amt);
        var data = { userId: user._id, balanceAmt: balanceAmt};
        $scope.pagedItems[index].balanceAmt = balanceAmt;
        $http.put('/api/balance',data).then(function(){
        });
        
      } else {
        console.log("else");
        $scope.pagedItems[index].balanceAmt = amt;
        $http.post('/api/balance',{userId: user._id, balanceAmt: amt}).then(function(){
        });
      }
    };
    
    $scope.setBalanceAmt = function(index){
    console.log("pagedItems: ", index);
    $http.get("/api/balance?userId=" + $scope.pagedItems[index]._id)
        .then(function(res) {
           if (res.data !== null) {
               $scope.pagedItems[index].balanceAmt = res.data.balanceAmt;
           }
        });
    };

  }
])

.filter('pagination', function() {
    return function(data, start){
        return data.slice(start);
    };
});
