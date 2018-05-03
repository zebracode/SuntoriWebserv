angular.module('userprices').controller('UserPriceController', ['$scope', '$location', '$stateParams', 'UserPricesService',
    function ($scope, $location, $stateParams, UserPricesService) {

        $scope.save = function(){
            if($scope.userPrice.owner) {
                $scope.update();
            } else {
                $scope.create();
            }
        };

        $scope.create = function () {
            var userPrice = new UserPricesService({
                bkPrice1: $scope.userPrice.bkPrice1,
                bkPrice2: $scope.userPrice.bkPrice2,
                bkPrice3: $scope.userPrice.bkPrice3,
                bkPrice4: $scope.userPrice.bkPrice4,
                bkPrice5: $scope.userPrice.bkPrice5,
                bkPrice6: $scope.userPrice.bkPrice6,
                bkPrice7: $scope.userPrice.bkPrice7,
                ctPrice1: $scope.userPrice.ctPrice1,
                ctPrice2: $scope.userPrice.ctPrice2,
                ctPrice3: $scope.userPrice.ctPrice3,
                ctPrice4: $scope.userPrice.ctPrice4,
                ctPrice5: $scope.userPrice.ctPrice5,
                ctPrice6: $scope.userPrice.ctPrice6,
                ctPrice7: $scope.userPrice.ctPrice7,
                owner: $stateParams.userId
            });

            userPrice.$save(function (response) {
                //$location.path('userprices/' + response._id);
                console.log("save success ...");
            }, function (errorResponse) {
                //$scope.error = errorResponse.data.message;con
                console.log("error respose ...");
            });
        }
        
        // Find All
        $scope.find = function () {
            $scope.userPrices = UserPricesService.query();
        };

        // Find One
        $scope.findOne = function () {
            $scope.userPrice = UserPricesService.get({
                userId: $stateParams.userId
            });
        };

        // Update
        $scope.update = function () {
            $scope.userPrice.$update({
                userId: $stateParams.userId
            },function () {
                //$location.path('userprices/' + $scope.userPrice._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Delete
        $scope.delete = function (userPrice) {
            if (userPrice) {
                userPrice.$remove(function () {
                    for (var i in $scope.userPrices) {
                        if ($scope.userPrices[i] === userPrice) {
                            $scope.userPrices.splice(i, 1);
                        }
                    }
                });
            } else {
                $scope.userPrice.$remove(function () {
                    $location.path('userPrices');
                });
            }
        };
    }]
);