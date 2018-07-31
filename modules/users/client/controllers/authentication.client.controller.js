'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'UserPricesService',
  function ($scope, $state, $http, $location, $window, Authentication, UserPricesService) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function () {
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // Boonchuay 31 July 2018 Start

        // Set default price to user
        var userPrice = new UserPricesService({
          bkPrice0: 0,
          bkPrice1: 42,
          bkPrice2: 52,
          bkPrice3: 67,
          bkPrice4: 82,
          bkPrice5: 97,
          bkPrice6: 122,
          bkPrice7: 132,
          bkPrice8: 142,
          bkPrice9: 152,
          bkPrice10: 162,
          bkPrice11: 172,
          bkPrice12: 192,
          bkPrice13: 212,
          bkPrice14: 232,
          bkPrice15: 252,
          bkPrice16: 272,
          bkPrice17: 292,
          bkPrice18: 312,
          bkPrice19: 332,
          bkPrice20: 352,
          bkPrice21: 372,
          bkPrice22: 452,
          bkPrice23: 492,
          bkPrice24: 502,
          bkPrice25: 522,
          bkPrice26: 537,
          bkPrice27: 552,
          bkPrice28: 562,
          bkPrice29: 582,
          bkPrice30: 597,
          bkPrice31: 612,
          ctPrice0: 0,
          ctPrice1: 42,
          ctPrice2: 52,
          ctPrice3: 67,
          ctPrice4: 82,
          ctPrice5: 97,
          ctPrice6: 122,
          ctPrice7: 132,
          ctPrice8: 142,
          ctPrice9: 152,
          ctPrice10: 162,
          ctPrice11: 172,
          ctPrice12: 192,
          ctPrice13: 212,
          ctPrice14: 232,
          ctPrice15: 252,
          ctPrice16: 272,
          ctPrice17: 292,
          ctPrice18: 312,
          ctPrice19: 332,
          ctPrice20: 352,
          ctPrice21: 372,
          ctPrice22: 452,
          ctPrice23: 492,
          ctPrice24: 502,
          ctPrice25: 522,
          ctPrice26: 537,
          ctPrice27: 552,
          ctPrice28: 562,
          ctPrice29: 582,
          ctPrice30: 597,
          ctPrice31: 612,
          owner: $scope.authentication.user._id
        });

        userPrice.$save(function (response) {
          //$location.path('userprices/' + response._id);
          //console.log("save success ...");
        }, function (errorResponse) {
          //$scope.error = errorResponse.data.message;con
          //console.log("error respose ...");
        });
        // Boonchuay 31 July 2018 End


        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      var redirect_to;

      if ($state.previous) {
        redirect_to = $state.previous.href;
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };
  }
]);
