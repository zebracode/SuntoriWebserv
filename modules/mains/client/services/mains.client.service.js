'use strict';

//Mains service used for communicating with the mains REST endpoints
angular.module('mains').factory('Mains', ['$resource',
  function ($resource) {
    return $resource('api/mains/:mainId', {
      mainId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
