'use strict';

angular.module('core').controller('HomeController',
    ['$scope', 'Authentication', 'usersService', '$mdSidenav', '$mdBottomSheet', '$log', '$http', 'Mains', '$filter', 'StatementsService',
        function ($scope, Authentication, usersService, $mdSidenav, $mdBottomSheet, $log, $http, Mains, $filter, StatementsService) {
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;

            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');

            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            }

            var toDay = new Date();
            $scope.startDate = new Date(toDay.getFullYear(), toDay.getMonth(), 1);
            $scope.endDate = new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0);

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function () {
                $log.log('Page changed to: ' + $scope.currentPage);
                $scope.mains = $scope.allPage[$scope.currentPage];
            };

            $scope.setTotalMains = function () {
                $http.get("/api/mainsTotal")
                    .then(function (response) {
                        $scope.totalMains = response.data;
                    });
            }

            // This provides Authentication context.
            $scope.authentication = Authentication;

            // Find a list of Mains
            $scope.find = function (viewName) {
                $scope.totalItems = 0;
                var data = {};

                // Home
                if (viewName === 'coreHome') {
                    console.log("Home...");
                }

                // Payment
                else if (viewName === 'mainsPayment') {
                    
                }

                // Summary
                else if (viewName === 'mainsSummary') {
                    $http({
                        method: "GET",
                        url: "/api/findMains?userId=" + Authentication.user._id 
                        + "&startDate=" + $scope.startDate
                        + "&endDate=" + $scope.endDate
                    }).then(function mySuccess(response) {
                        setPaging(response.data);
                    }, function myError(response) {
                        $scope.error = errorResponse.data.message;
                    });
                }

                // Admin User List
                else if(viewName === "userList"){
                    $http({
                        method: "GET",
                        url: "/api/findMains?startDate=" + $scope.startDate
                        + "&endDate=" + $scope.endDate
                    }).then(function mySuccess(response) {
                        setPaging(response.data);
                    }, function myError(response) {
                        $scope.error = errorResponse.data.message;
                    });
                }

                // Statements 
                else if (viewName === 'statementsList') {
                    
                }

                // Other cases
                else {
                    data = {
                        userId: $scope.selectedUserId,
                        startDate: $scope.startDate,
                        endDate: $scope.endDate
                    };

                    $scope.mains = Mains.query(
                        data,
                        function (mains) {
                            var tempMains = [];
                            var pageMains = [];
                            var pageIndex = 0;
                            var itemCount = 0;
                            for (var i = 0; i < mains.length; i++) {
                                if (!mains[i].status) {
                                    continue;
                                }
                                if (mains[i].status !== "ยังไม่ได้ชำระเงิน") {
                                    itemCount++;
                                    tempMains.push(mains[i]);
                                    if ((itemCount % $scope.itemsPerPage === 0) && (itemCount !== 0)) {
                                        pageIndex++;
                                        pageMains[pageIndex] = tempMains;
                                        tempMains = [];
                                    }
                                    $scope.totalItems += 1;
                                }
                            }

                            if (tempMains.length > 0) {
                                pageMains[pageIndex + 1] = tempMains;
                            }

                            $scope.allPage = pageMains;

                            // Set first page
                            $scope.mains = pageMains[1];
                        });
                }

                // Get price list
                $http.get('/price')
                    .then(function (response) {
                        $scope.price = response.data;
                    });
            };

            $scope.printformA6 = function (main) {
                console.log("Print AW FormA6");
                //$http.get('/print/awpost');
            }

            $scope.printformA5 = function (main) {
                console.log("Print AW FormA5");
                //$http.get('/print/awpost');
            }

            $scope.printformA4 = function (main) {
                console.log("Print AW FormA4");
                //$http.get('/print/awpost');
            }

            // Remove existing Main
            $scope.remove = function (main) {
                if (main) {
                    main.$remove();

                    for (var i in $scope.mains) {
                        if ($scope.mains[i] === main) {
                            $scope.mains.splice(i, 1);
                        }
                    }
                } else {
                    $scope.main.$remove(function () {
                        $location.path('mains');
                    });
                }
            };

            // When change start date
            $scope.startDateChanged = function () {
                $scope.find("listClient");
            };

            // When change end date
            $scope.endDateChanged = function () {
                $scope.find("listClient");
            };


            // Set to Today
            $scope.todaySet = function () {
                $scope.startDate = new Date();
                $scope.startDate.setHours(0, 0, 0, 0);
                $scope.endDate = new Date();
                $scope.find("listClient");
            };


            // Select user
            $scope.userSelectChanged = function (users) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].displayName === $scope.user.displayName) {
                        $scope.selectedUserId = users[i]._id;
                        $scope.find("listClient");
                    }

                }

            };

            // Select user
            $scope.userSelectClear = function (users) {
                $scope.user.displayName = null;
                $scope.selectedUserId = null;
                $scope.find("listClient");
            };

            // Start List Statements
            $scope.statements = StatementsService.query();
            // End List Statements

            // Start Export Excel of Statements
            // Export Excel
            $scope.exportExcel = function () {
                window.location.href = '/api/excel/statements'
            };
            // End Export Excel of Statements

            // Boonchuay 2 August 2018 Start
            // Barcode autocomplete
            $scope.getBarcode = function (searchText) {
                var userId = "";
                if ($scope.authentication) {
                    if ($scope.authentication.user) {
                        if ($scope.authentication.user._id) {
                            userId = $scope.authentication.user._id;
                        }
                    }
                }
                return $http
                    .get('/api/mainByBarcode?searchText=' + searchText + '&userId=' + userId)
                    .then(function (response) {
                        //$scope.barcodes = response.data;
                        return response.data;
                    });
            };

            $scope.setBarcodeData = function (selectedMain) {
                if (selectedMain) {
                    $scope.barcodes = [];
                    $scope.barcodes[0] = selectedMain;
                } else {
                    $scope.barcodes = null;
                }

            }
            // Boonchuay 2 August 2018 End

            // Boonchuay 6 August 2018 Start
            // Export summary as Excel
            $scope.exportSummary = function (viewName) {
                // Summmary
                if(viewName === 'mainsSummary'){
                    window.location.href = "/api/excel/summary?userId=" + Authentication.user._id
                    + "&startDate=" + $scope.startDate
                    + "&endDate=" + $scope.endDate;
                }

                // Admin User List
                else if(viewName === 'userList'){
                    window.location.href = "/api/excel/summary?startDate=" + $scope.startDate
                    + "&endDate=" + $scope.endDate;
                }
                
            };
            // Boonchuay 6 August 2018 End

            /**
             * Main Controller for the Angular Material Starter App
             * @param $scope
             * @param $mdSidenav
             * @param avatarsService
             * @constructor
             */


            // Load all registered users

            usersService
                .loadAll()
                .then(function (users) {
                    self.users = [].concat(users);
                    self.selected = users[0];
                });

            // *********************************
            // Internal methods
            // *********************************

            /**
             * Hide or Show the 'left' sideNav area
             */
            function toggleUsersList() {
                $mdSidenav('left').toggle();
            }

            /**
             * Select the current avatars
             * @param menuId
             */
            function selectUser(user) {
                self.selected = angular.isNumber(user) ? $scope.users[user] : user;
                self.toggleList();
            }

            /**
             * Show the bottom sheet
             */
            function share($event) {
                var user = self.selected;

                /**
                 * Bottom Sheet controller for the Avatar Actions
                 */
                function UserSheetController($mdBottomSheet) {
                    this.user = user;
                    this.items = [
                        { name: 'Phone', icon: 'phone' },
                        { name: 'Twitter', icon: 'twitter' },
                        { name: 'Google+', icon: 'google_plus' },
                        { name: 'Hangout', icon: 'hangouts' }
                    ];
                    this.performAction = function (action) {
                        $mdBottomSheet.hide(action);
                    };
                }

                $mdBottomSheet.show({
                    parent: angular.element(document.getElementById('content')),
                    templateUrl: 'modules/core/views/contactSheet.html',
                    controller: ['$mdBottomSheet', UserSheetController],
                    controllerAs: 'vm',
                    bindToController: true,
                    targetEvent: $event
                }).then(function (clickedItem) {
                    $log.debug(clickedItem.name + ' clicked!');
                });

            }

            // Page rendering
            function setPaging(data) {
                var tempData = [];
                var pageData = [];
                var pageIndex = 0;
                var itemCount = 0;
                for (var i = 0; i < data.length; i++) {
                    if (!data[i].status) {
                        continue;
                    }
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
                $scope.mains = pageData[1];
            }

            var self = this;

            self.selected = null;
            self.users = [];
            self.selectUser = selectUser;
            self.toggleList = toggleUsersList;
            self.share = share;

        }
    ]);

