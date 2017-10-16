'use strict';

// Configuring the Mains module
angular.module('mains').run(['Menus',
  function (Menus) {
    // Add the mains dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Mains',
      state: 'mains',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'mains', {
      title: 'List Mains',
      state: 'mains.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'mains', {
      title: 'Create Mains',
      state: 'mains.create'
    });
  }
]);
