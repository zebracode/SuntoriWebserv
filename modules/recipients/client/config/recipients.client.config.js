'use strict';

// Configuring the Recipients module
angular.module('recipients').run(['Menus',
  function (Menus) {
    // Add the recipients dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Recipients',
      state: 'recipients',
      type: 'dropdown'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'recipients', {
      title: 'List Recipients',
      state: 'recipients.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'recipients', {
      title: 'Create Recipients',
      state: 'recipients.create'
    });
  }
]);
