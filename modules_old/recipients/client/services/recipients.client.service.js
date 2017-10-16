'use strict';

//Recipients service used for communicating with the recipients REST endpoints
angular.module('recipients').factory('Recipients', ['$resource',
  function ($resource) {
    return $resource('api/recipients/:recipientId', {
      recipientId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
