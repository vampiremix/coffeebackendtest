'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function(app) {
  // Products Routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  app.route('/api/products/cate/:cateId').all(productsPolicy.isAllowed)
  .get(products.filterproductBycateID);

  app.route('/api/products/shop/:shopId').all(productsPolicy.isAllowed)
  .get(products.filterproductByshopID);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
  app.param('cateId', products.productBycateID);
  app.param('shopId',products.productByshopID);
};
