(function () {
  'use strict';

  angular
    .module('statements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('statements', {
        abstract: true,
        url: '/statements',
        template: '<ui-view/>'
      })
      .state('statements.list', {
        url: '',
        templateUrl: 'modules/statements/views/list-statements.client.view.html',
        controller: 'StatementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Statements List'
        }
      })
      .state('statements.create', {
        url: '/create',
        templateUrl: 'modules/statements/views/form-statement.client.view.html',
        controller: 'StatementsController',
        controllerAs: 'vm',
        resolve: {
          statementResolve: newStatement
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Statements Create'
        }
      })
      .state('statements.edit', {
        url: '/:statementId/edit',
        templateUrl: 'modules/statements/client/views/form-statement.client.view.html',
        controller: 'StatementsController',
        controllerAs: 'vm',
        resolve: {
          statementResolve: getStatement
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Statement {{ statementResolve.name }}'
        }
      })
      .state('statements.view', {
        url: '/:statementId',
        templateUrl: 'modules/statements/client/views/view-statement.client.view.html',
        controller: 'StatementsController',
        controllerAs: 'vm',
        resolve: {
          statementResolve: getStatement
        },
        data: {
          pageTitle: 'Statement {{ statementResolve.name }}'
        }
      });
  }

  getStatement.$inject = ['$stateParams', 'StatementsService'];

  function getStatement($stateParams, StatementsService) {
    return StatementsService.get({
      statementId: $stateParams.statementId
    }).$promise;
  }

  newStatement.$inject = ['StatementsService'];

  function newStatement(StatementsService) {
    return new StatementsService();
  }
}());
