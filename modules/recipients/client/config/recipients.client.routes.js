'use strict';

// Setting up route
angular.module('recipients').config(['$stateProvider',
  function ($stateProvider) {
    // Recipients state routing
    $stateProvider
      .state('recipients', {
        abstract: true,
        url: '/recipients',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('recipients.list', {
        url: '',
        templateUrl: 'modules/recipients/views/list-recipients.client.view.html'
      })
      .state('recipients.create', {
        url: '/create',
        templateUrl: 'modules/recipients/views/create-recipient.client.view.html'
      })
      .state('recipients.view', {
        url: '/:recipientId',
        templateUrl: 'modules/recipients/views/view-recipient.client.view.html'
      })
      .state('recipients.edit', {
        url: '/:recipientId/edit',
        templateUrl: 'modules/recipients/views/edit-recipient.client.view.html'
      });
  }
]);
