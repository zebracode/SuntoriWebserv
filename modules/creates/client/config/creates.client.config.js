(function () {
  'use strict';

  angular
    .module('creates')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Creates',
      state: 'creates',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'creates', {
      title: 'List Creates',
      state: 'creates.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'creates', {
      title: 'Create Create',
      state: 'creates.create',
      roles: ['user']
    });
  }
}());
