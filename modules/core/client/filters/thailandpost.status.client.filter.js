angular.module('core').filter('updateStatus', ['$http', '$location', 'Authentication', 'UserPricesService',
    function ($http, $location, Authentication, UserPricesService) {
        return function (barcode, status, userId) {
            var perimeter = ['กรุงเทพมหานคร', 'กรุงเทพฯ', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];
            var userPrices = [];

            if (barcode.length < 1) {
                return "";
            }

            $http.get("/getOrderStatus?barcode=" + barcode)
                .then(function (response) {
                    var status = response.data.statusDescription;
                    var tpWeight = response.data.productWeight;
                    var senderProvice = response.data.provinceName ;
                    var receiverProvince = response.data.customerProvince ;
                    var afterPrice = 0;
                    var data = {};

                    // Get prices of user
                    UserPricesService.get({
                        userId: userId
                    }, function (userPrice) {
                        userPrices.push({ weight: 0, bkPrice: userPrice.bkPrice0, ctPrice: userPrice.ctPrice0 });
                        userPrices.push({ weight: 250, bkPrice: userPrice.bkPrice1, ctPrice: userPrice.ctPrice1 });
                        userPrices.push({ weight: 500, bkPrice: userPrice.bkPrice2, ctPrice: userPrice.ctPrice2 });
                        userPrices.push({ weight: 1000, bkPrice: userPrice.bkPrice3, ctPrice: userPrice.ctPrice3 });
                        userPrices.push({ weight: 1500, bkPrice: userPrice.bkPrice4, ctPrice: userPrice.ctPrice4 });
                        userPrices.push({ weight: 2000, bkPrice: userPrice.bkPrice5, ctPrice: userPrice.ctPrice5 });
                        userPrices.push({ weight: 2500, bkPrice: userPrice.bkPrice6, ctPrice: userPrice.ctPrice6 });
                        userPrices.push({ weight: 3000, bkPrice: userPrice.bkPrice7, ctPrice: userPrice.ctPrice7 });
                        userPrices.push({ weight: 3500, bkPrice: userPrice.bkPrice8, ctPrice: userPrice.ctPrice8 });
                        userPrices.push({ weight: 4000, bkPrice: userPrice.bkPrice9, ctPrice: userPrice.ctPrice9 });
                        userPrices.push({ weight: 4500, bkPrice: userPrice.bkPrice10, ctPrice: userPrice.ctPrice10 });
                        userPrices.push({ weight: 5000, bkPrice: userPrice.bkPrice11, ctPrice: userPrice.ctPrice11 });
                        userPrices.push({ weight: 5500, bkPrice: userPrice.bkPrice12, ctPrice: userPrice.ctPrice12 });
                        userPrices.push({ weight: 6000, bkPrice: userPrice.bkPrice13, ctPrice: userPrice.ctPrice13 });
                        userPrices.push({ weight: 6500, bkPrice: userPrice.bkPrice14, ctPrice: userPrice.ctPrice14 });
                        userPrices.push({ weight: 7000, bkPrice: userPrice.bkPrice15, ctPrice: userPrice.ctPrice15 });
                        userPrices.push({ weight: 7500, bkPrice: userPrice.bkPrice16, ctPrice: userPrice.ctPrice16 });
                        userPrices.push({ weight: 8000, bkPrice: userPrice.bkPrice17, ctPrice: userPrice.ctPrice17 });
                        userPrices.push({ weight: 8500, bkPrice: userPrice.bkPrice18, ctPrice: userPrice.ctPrice18 });
                        userPrices.push({ weight: 9000, bkPrice: userPrice.bkPrice19, ctPrice: userPrice.ctPrice19 });
                        userPrices.push({ weight: 9500, bkPrice: userPrice.bkPrice20, ctPrice: userPrice.ctPrice20 });
                        userPrices.push({ weight: 10000, bkPrice: userPrice.bkPrice21, ctPrice: userPrice.ctPrice21 });
                        userPrices.push({ weight: 11000, bkPrice: userPrice.bkPrice22, ctPrice: userPrice.ctPrice22 });
                        userPrices.push({ weight: 12000, bkPrice: userPrice.bkPrice23, ctPrice: userPrice.ctPrice23 });
                        userPrices.push({ weight: 13000, bkPrice: userPrice.bkPrice24, ctPrice: userPrice.ctPrice24 });
                        userPrices.push({ weight: 14000, bkPrice: userPrice.bkPrice25, ctPrice: userPrice.ctPrice25 });
                        userPrices.push({ weight: 15000, bkPrice: userPrice.bkPrice26, ctPrice: userPrice.ctPrice26 });
                        userPrices.push({ weight: 16000, bkPrice: userPrice.bkPrice27, ctPrice: userPrice.ctPrice27 });
                        userPrices.push({ weight: 17000, bkPrice: userPrice.bkPrice28, ctPrice: userPrice.ctPrice28 });
                        userPrices.push({ weight: 18000, bkPrice: userPrice.bkPrice29, ctPrice: userPrice.ctPrice29 });
                        userPrices.push({ weight: 19000, bkPrice: userPrice.bkPrice30, ctPrice: userPrice.ctPrice30 });
                        userPrices.push({ weight: 20000, bkPrice: userPrice.bkPrice31, ctPrice: userPrice.ctPrice31 });
                        userPrices.sort(function (a, b) { return a.weight - b.weight }); // Sort by weight

                        for (var i = 0; i < userPrices.length; i++) {
                            if (tpWeight <= userPrices[i].weight) {
                                if (perimeter.includes(senderProvice) && perimeter.includes(receiverProvince)) {
                                    afterPrice = userPrices[i].bkPrice;
                                } else {
                                    afterPrice = userPrices[i].ctPrice;
                                }
                                break;
                            }
                        }

                        data = {
                            "barcode": barcode,
                            "status": status,
                            tpWeight: tpWeight,
                            afterPrice: afterPrice
                        };

                        $http.post("/api/update/mains", data)
                            .then(function (response) {
                            });

                    });

                });

            return "";
        };
    }]);