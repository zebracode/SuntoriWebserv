'use strict';

// Setting up route
angular.module('mains').config(['$stateProvider',
  function ($stateProvider) {
    // Mains state routing
    $stateProvider
      .state('mains', {
        abstract: true,
        url: '/mains',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('mains.list', {
        url: '',
        templateUrl: 'modules/mains/views/list-mains.client.view.html'
      })
      .state('mains.create', {
        url: '/create',
        templateUrl: 'modules/mains/views/create-main.client.view.html'
      })
      .state('mains.view', {
        url: '/:mainId',
        templateUrl: 'modules/mains/views/view-main.client.view.html'
      })
      .state('mains.dropoff', {
        url: '/dropoff',
        templateUrl: 'modules/mains/views/dropoff-mains.client.view.html'
            })
      .state('mains.edit', {
        url: '/:mainId/edit',
        templateUrl: 'modules/mains/views/edit-main.client.view.html'
      });
  }
]);
