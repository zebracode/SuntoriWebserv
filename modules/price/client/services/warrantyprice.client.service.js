angular.module('price').factory('WarrantyPrice', ['$resource',
    function ($resource) {
        return $resource('api/warrantyprice/:warrantyPriceId', {
            warrantyPriceId: '@_id'
        }, {
                update: {
                    method: 'PUT'
                }
            });
    }]
);