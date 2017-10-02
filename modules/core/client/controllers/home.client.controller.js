//'use strict';
//
//angular.module('core').controller('HomeController', ['$scope', 'Authentication',
//  function ($scope, Authentication) {
//    // This provides Authentication context.
//    $scope.authentication = Authentication;
//  }
//]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
'usersService', '$mdSidenav', '$mdBottomSheet', '$log', '$http', 'Mains',
    function($scope, Authentication, usersService, $mdSidenav, $mdBottomSheet, $log, $http, Mains, thailandPostStatus) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        // Find a list of Mains
        $scope.find = function () {
            $scope.mains = Mains.query(function(mains) {
                console.log("mains", mains);
            });

            $http.get('/price')
            .then(function(response){
                $scope.price = response.data;
                console.log("price", $scope.price);
            });
            
        };

        $scope.printformA6 = function(main) {
                    console.log("Print AW FormA6");
                    //$http.get('/print/awpost');
        }

        $scope.printformA5 = function(main) {
            console.log("Print AW FormA5");
            //$http.get('/print/awpost');
        }

        $scope.printformA4 = function(main) {
                    console.log("Print AW FormA4");
                    //$http.get('/print/awpost');
        }

        // Pagination
        $scope.pagedItems = [];
        $scope.itemsPerPage = 5;
        $scope.currentPage = 1;
        $scope.pageSize = 10;


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
            .then( function( users ) {
                self.users    = [].concat(users);
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
        function selectUser ( user ) {
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
            function UserSheetController( $mdBottomSheet ) {
                this.user = user;
                this.items = [
                    { name: 'Phone'       , icon: 'phone'       },
                    { name: 'Twitter'     , icon: 'twitter'     },
                    { name: 'Google+'     , icon: 'google_plus' },
                    { name: 'Hangout'     , icon: 'hangouts'    }
                ];
                this.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }

            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'modules/core/views/contactSheet.html',
                controller: [ '$mdBottomSheet', UserSheetController],
                controllerAs: 'vm',
                bindToController : true,
                targetEvent: $event
            }).then(function(clickedItem) {
                $log.debug( clickedItem.name + ' clicked!');
            });

        }

        var self = this;

        self.selected     = null;
        self.users        = [ ];
        self.selectUser   = selectUser;
        self.toggleList   = toggleUsersList;
        self.share        = share;

    }

]);

