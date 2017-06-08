// Creates service used to communicate Creates REST endpoints
(function () {
  'use strict';

  angular
    .module('creates')
    .factory('CreatesService', CreatesService);

  CreatesService.$inject = ['$resource'];

  function CreatesService($resource) {
    return $resource('api/creates/:createId', {
      createId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
