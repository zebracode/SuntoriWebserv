'use strict';

angular.module('users').factory('StatementsService', ['$resource',
  function ($resource) {
    return $resource('api/statements/:statementId', {
      statementId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });
  }]);
