(function () {
  'use strict';

  angular
    .module('favorites')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Favorites',
      state: 'favorites',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'favorites', {
      title: 'List Favorites',
      state: 'favorites.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'favorites', {
      title: 'Create Favorite',
      state: 'favorites.create',
      roles: ['user']
    });
  }
}());
