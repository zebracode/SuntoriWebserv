'use strict';

angular.module('mains').factory('Recipients', ['$resource',
function ($resource) {
  return $resource('/api/recipients/:recipientId', {
    recipientId: '@_id'
  }, {
      update: {
        method: 'PUT'
      }
    });
}]);