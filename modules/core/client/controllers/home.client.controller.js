'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    'usersService', '$mdSidenav', '$mdBottomSheet', '$log', '$http', 'Mains', '$filter',
    function ($scope, Authentication, usersService, $mdSidenav, $mdBottomSheet, $log, $http, Mains, thailandPostStatus, $filter) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;

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
            var data = {}
            if (viewName === 'summary') {
                data = {
                    user: Authentication.user._id
                };
            } else {
                data = {
                    userId: $scope.selectedUserId,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                };
            }

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
            console.log("start date change: ", $scope.startDate);
            $scope.find("listClient");

        };

        // When change end date
        $scope.endDateChanged = function () {
            console.log("end date change: ", $scope.endDate);
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

        var self = this;

        self.selected = null;
        self.users = [];
        self.selectUser = selectUser;
        self.toggleList = toggleUsersList;
        self.share = share;

    }
]);

