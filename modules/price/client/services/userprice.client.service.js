angular.module('userprices').factory('UserPricesService', ['$resource',
    function ($resource) {
        return $resource('api/userprices/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        })
    }
]);