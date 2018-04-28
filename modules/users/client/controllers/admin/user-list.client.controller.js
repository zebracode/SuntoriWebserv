'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin', '$mdDialog', '$http', 'StatementsService',
  function ($scope, $filter, Admin, $mdDialog, $http, StatementsService) {

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;

    Admin.query(function (data) {
      $scope.users = data;
      $scope.allUser = data;
      $scope.buildPager(data);
    });

    $scope.buildPager = function (data) {
      var tempData = [];
      var pageData = [];
      var pageIndex = 0;
      var itemCount = 0;
      for(var i=0; i<data.length; i++) {
          itemCount++;
          tempData.push(data[i]);
          if((itemCount % $scope.itemsPerPage === 0) && (itemCount !== 0)){
              pageIndex++;
              pageData[pageIndex] = tempData;
              tempData = [];
          }
          $scope.totalItems += 1; 
          $scope.totalUsers = $scope.totalItems;
      }

      if(tempData.length > 0) {
        pageData[pageIndex + 1] = tempData;
      }
      
      $scope.allPage = pageData;

      // Set first page
      $scope.users = pageData[1];

      $scope.pagedItems = pageData[1];

      //$scope.figureOutItemsToDisplay();
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
      $scope.users = $scope.allPage[$scope.currentPage];
      $scope.pagedItems = $scope.allPage[$scope.currentPage];
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
            saveStatement(parseInt($scope.pagedItems[index].balanceAmt), parseInt(result));
          }, function() {
            $scope.status = 'You didn\'t name your dog.';
        });
    };
    
    $scope.updateBalance = function (user, index, amt) {
      var balanceAmt = parseInt($scope.pagedItems[index].balanceAmt);
      if (!isNaN(balanceAmt)){
        balanceAmt += parseInt(amt);
        var data = { userId: user._id, balanceAmt: balanceAmt};
        $scope.pagedItems[index].balanceAmt = balanceAmt;
        $http.put('/api/balance',data).then(function(){
        });
        
      } else {
        $scope.pagedItems[index].balanceAmt = amt;
        $http.post('/api/balance',{userId: user._id, balanceAmt: amt}).then(function(){
        });
      }
    };
    
    $scope.setBalanceAmt = function(index){
    $http.get("/api/balance?userId=" + $scope.pagedItems[index]._id)
        .then(function(res) {
           if (res.data !== null) {
               $scope.pagedItems[index].balanceAmt = res.data.balanceAmt;
           }
        });
    };

    //Add to statement
    function saveStatement(balanceAmount, amount) {
      var statement = new StatementsService({
        name: "เติมเงินผ่าน Admin",
        amountIn: amount > 0 ? amount : 0,
        amountOut: amount < 0 ? amount : 0,
        balanceAmount: balanceAmount
      });

      statement.$save(function(response){
        
      }, function(errorResponse){

      });
    }


  }
])

.filter('pagination', function() {
    return function(data, start){
        if (typeof data !== "undefined" )
        return data.slice(start);
    };
});
