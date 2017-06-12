'use strict';

// Setting up route
angular.module('sends').config(['$stateProvider',
  function ($stateProvider) {
    // Sends state routing
    $stateProvider
      .state('sends', {
        abstract: true,
        url: '/sends',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('sends.list', {
        url: '',
        templateUrl: 'modules/sends/views/list-sends.client.view.html'
      })
      .state('sends.create', {
        url: '/create',
        templateUrl: 'modules/sends/views/create-send.client.view.html'
      })
      .state('sends.view', {
        url: '/:sendId',
        templateUrl: 'modules/sends/views/view-send.client.view.html'
      })
      .state('sends.edit', {
        url: '/:sendId/edit',
        templateUrl: 'modules/sends/views/edit-send.client.view.html'
      });
  }
]);
