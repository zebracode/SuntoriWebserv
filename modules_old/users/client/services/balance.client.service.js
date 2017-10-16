'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Balance', ['$resource',
  function ($resource) {
    return $resource('api/balance', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

