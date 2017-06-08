(function () {
  'use strict';

  angular
    .module('creates')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('creates', {
        abstract: true,
        url: '/creates',
        template: '<ui-view/>'
      })
      .state('creates.list', {
        url: '',
        templateUrl: 'modules/creates/client/views/list-creates.client.view.html',
        controller: 'CreatesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Creates List'
        }
      })
      .state('creates.create', {
        url: '/create',
        templateUrl: 'modules/creates/client/views/form-create.client.view.html',
        controller: 'CreatesController',
        controllerAs: 'vm',
        resolve: {
          createResolve: newCreate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Creates Create'
        }
      })
      .state('creates.edit', {
        url: '/:createId/edit',
        templateUrl: 'modules/creates/client/views/form-create.client.view.html',
        controller: 'CreatesController',
        controllerAs: 'vm',
        resolve: {
          createResolve: getCreate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Create {{ createResolve.name }}'
        }
      })
      .state('creates.view', {
        url: '/:createId',
        templateUrl: 'modules/creates/client/views/view-create.client.view.html',
        controller: 'CreatesController',
        controllerAs: 'vm',
        resolve: {
          createResolve: getCreate
        },
        data: {
          pageTitle: 'Create {{ createResolve.name }}'
        }
      });
  }

  getCreate.$inject = ['$stateParams', 'CreatesService'];

  function getCreate($stateParams, CreatesService) {
    return CreatesService.get({
      createId: $stateParams.createId
    }).$promise;
  }

  newCreate.$inject = ['CreatesService'];

  function newCreate(CreatesService) {
    return new CreatesService();
  }
}());
