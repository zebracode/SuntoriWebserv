(function () {
  'use strict';

  angular
    .module('statements')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Statements',
      state: 'statements',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'statements', {
      title: 'List Statements',
      state: 'statements.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'statements', {
      title: 'Create Statement',
      state: 'statements.create',
      roles: ['user']
    });
  }
}());
