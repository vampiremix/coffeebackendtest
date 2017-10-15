(function () {
  'use strict';

  angular
    .module('shops')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Shops',
      state: 'shops',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'shops', {
      title: 'List Shops',
      state: 'shops.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'shops', {
      title: 'Create Shop',
      state: 'shops.create',
      roles: ['user']
    });
  }
}());
