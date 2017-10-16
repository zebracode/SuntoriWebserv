angular.module('users.admin').filter('balance', ['$http', function($http){
    return function(userId){
        $http.get("/api/balance").then(function(res) {
            return "ddd";
        });
         
    };
}]);
