(function () {
  'use strict';

  angular
    .module('products')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Products',
      state: 'products',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Products',
      state: 'products.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Product',
      state: 'products.create',
      roles: ['user']
    });
  }
}());
