// Statements service used to communicate Statements REST endpoints
(function () {
  'use strict';

  angular
    .module('statements')
    .factory('StatementsService', StatementsService);

  StatementsService.$inject = ['$resource'];

  function StatementsService($resource) {
    return $resource('api/statements/:statementId', {
      statementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
