'use strict';

//Sends service used for communicating with the sends REST endpoints
angular.module('sends').factory('Sends', ['$resource',
  function ($resource) {
    return $resource('api/sends/:sendId', {
      sendId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
       query: {
         method: 'GET',
         isArray: true
       },
       get: {
         method: 'GET'
       }
    });
  }
]);
