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
                bkPrice0: $scope.userPrice.bkPrice0,
                bkPrice1: $scope.userPrice.bkPrice1,
                bkPrice2: $scope.userPrice.bkPrice2,
                bkPrice3: $scope.userPrice.bkPrice3,
                bkPrice4: $scope.userPrice.bkPrice4,
                bkPrice5: $scope.userPrice.bkPrice5,
                bkPrice6: $scope.userPrice.bkPrice6,
                bkPrice7: $scope.userPrice.bkPrice7,
                bkPrice8: $scope.userPrice.bkPrice8,
                bkPrice9: $scope.userPrice.bkPrice9,
                bkPrice10: $scope.userPrice.bkPrice10,
                bkPrice11: $scope.userPrice.bkPrice11,
                bkPrice12: $scope.userPrice.bkPrice12,
                bkPrice13: $scope.userPrice.bkPrice13,
                bkPrice14: $scope.userPrice.bkPrice14,
                bkPrice15: $scope.userPrice.bkPrice15,
                bkPrice16: $scope.userPrice.bkPrice16,
                bkPrice17: $scope.userPrice.bkPrice17,
                bkPrice18: $scope.userPrice.bkPrice18,
                bkPrice19: $scope.userPrice.bkPrice19,
                bkPrice20: $scope.userPrice.bkPrice20,
                bkPrice21: $scope.userPrice.bkPrice21,
                bkPrice22: $scope.userPrice.bkPrice22,
                bkPrice23: $scope.userPrice.bkPrice23,
                bkPrice24: $scope.userPrice.bkPrice24,
                bkPrice25: $scope.userPrice.bkPrice25,
                bkPrice26: $scope.userPrice.bkPrice26,
                bkPrice27: $scope.userPrice.bkPrice27,
                bkPrice28: $scope.userPrice.bkPrice28,
                bkPrice29: $scope.userPrice.bkPrice29,
                bkPrice30: $scope.userPrice.bkPrice30,
                bkPrice31: $scope.userPrice.bkPrice31,
                ctPrice0: $scope.userPrice.ctPrice0,
                ctPrice1: $scope.userPrice.ctPrice1,
                ctPrice2: $scope.userPrice.ctPrice2,
                ctPrice3: $scope.userPrice.ctPrice3,
                ctPrice4: $scope.userPrice.ctPrice4,
                ctPrice5: $scope.userPrice.ctPrice5,
                ctPrice6: $scope.userPrice.ctPrice6,
                ctPrice7: $scope.userPrice.ctPrice7,
                ctPrice8: $scope.userPrice.ctPrice8,
                ctPrice9: $scope.userPrice.ctPrice9,
                ctPrice10: $scope.userPrice.ctPrice10,
                ctPrice11: $scope.userPrice.ctPrice11,
                ctPrice12: $scope.userPrice.ctPrice12,
                ctPrice13: $scope.userPrice.ctPrice13,
                ctPrice14: $scope.userPrice.ctPrice14,
                ctPrice15: $scope.userPrice.ctPrice15,
                ctPrice16: $scope.userPrice.ctPrice16,
                ctPrice17: $scope.userPrice.ctPrice17,
                ctPrice18: $scope.userPrice.ctPrice18,
                ctPrice19: $scope.userPrice.ctPrice19,
                ctPrice20: $scope.userPrice.ctPrice20,
                ctPrice21: $scope.userPrice.ctPrice21,
                ctPrice22: $scope.userPrice.ctPrice22,
                ctPrice23: $scope.userPrice.ctPrice23,
                ctPrice24: $scope.userPrice.ctPrice24,
                ctPrice25: $scope.userPrice.ctPrice25,
                ctPrice26: $scope.userPrice.ctPrice26,
                ctPrice27: $scope.userPrice.ctPrice27,
                ctPrice28: $scope.userPrice.ctPrice28,
                ctPrice29: $scope.userPrice.ctPrice29,
                ctPrice30: $scope.userPrice.ctPrice30,
                ctPrice31: $scope.userPrice.ctPrice31,
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
