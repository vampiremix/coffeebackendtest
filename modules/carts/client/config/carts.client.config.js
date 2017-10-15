(function () {
  'use strict';

  angular
    .module('carts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Carts',
      state: 'carts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'carts', {
      title: 'List Carts',
      state: 'carts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'carts', {
      title: 'Create Cart',
      state: 'carts.create',
      roles: ['user']
    });
  }
}());
