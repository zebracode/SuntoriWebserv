'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
      .state('core', {
        url: '/core',
        templateUrl: 'modules/core/client/views/create.client.view.html',
        controller: 'CreateController',
        controllerAs: 'vm'
      })
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('recipient', {
              url: '/recipient',
              templateUrl: 'modules/core/views/recipient.client.view.html'
            })
      .state('send', {
              url: '/send',
              templateUrl: 'modules/core/views/send.client.view.html'
            })
      .state('create', {
              url: '/create',
              templateUrl: 'modules/core/views/create.client.view.html'
            })
      .state('user', {
              url: '/admin',
              templateUrl: 'modules/users/views/admin/list-users.client.view.html'
            })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/views/404.client.view.html'
      });
  }
]);
