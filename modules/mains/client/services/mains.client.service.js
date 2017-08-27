'use strict';

//Mains service used for communicating with the mains REST endpoints
angular.module('mains').factory('Mains', ['$resource',
  function ($resource) {
    var resource = $resource('api/mains/:mainId', {
      mainId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getMain : {
        method: 'GET',
        isArray: true
      },
      getCores : {
        method: 'GET',
        isArray: true
      }
    });
    
    resource.retrieveMain = function(user) {
      return this.getMain(
        {
         user: user,
         status: 'ยังไม่ได้ชำระเงิน'
        }
      );
    };
    
    return resource;
  }
]);
