'use strict';

// Configuring the Sends module
angular.module('sends').run(['Menus',
  function (Menus) {
    // Add the sends dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Sends',
      state: 'sends',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sends', {
      title: 'List Sends',
      state: 'sends.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sends', {
      title: 'Create Sends',
      state: 'sends.create'
    });
  }
]);
