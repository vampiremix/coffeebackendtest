'use strict'

/**
 * Module dependencies
 */
var ordersPolicy = require('../policies/orders.server.policy'),
  orders = require('../controllers/orders.server.controller')

module.exports = function (app) {
  // Orders Routes
  app.route('/api/orders').all(ordersPolicy.isAllowed)
    .get(orders.list)
    .post(orders.create)

  app.route('/api/orders/create/:shopId').all(ordersPolicy.isAllowed)
    .post(orders.genRunningOrder, orders.createOrder)

  app.route('/api/orders/orderslist/:shopId').all(ordersPolicy.isAllowed)
    .get(orders.getOrderByShop)  

  app.route('/api/orders/:orderId').all(ordersPolicy.isAllowed)
    .get(orders.read)
    .put(orders.update)
    .delete(orders.delete)

  // Finish by binding the Order middleware
  app.param('orderId', orders.orderByID)
  app.param('shopId', orders.createorderByShopID)
}
