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
                bkPrice1: this.bkPrice1,
                bkPrice2: this.bkPrice2,
                bkPrice3: this.bkPrice3,
                bkPrice4: this.bkPrice4,
                bkPrice5: this.bkPrice5,
                bkPrice6: this.bkPrice6,
                bkPrice7: this.bkPrice7,
                ctPrice1: this.ctPrice1,
                ctPrice2: this.ctPrice2,
                ctPrice3: this.ctPrice3,
                ctPrice4: this.ctPrice4,
                ctPrice5: this.ctPrice5,
                ctPrice6: this.ctPrice6,
                ctPrice7: this.ctPrice7,
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