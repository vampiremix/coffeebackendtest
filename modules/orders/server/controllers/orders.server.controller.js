'use strict'

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Shop = mongoose.model('Shop'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash')

/**
 * Create a Order
 */
exports.create = function (req, res) {
  var order = new Order(req.body)
  order.user = req.user ? req.user : order.user
  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.jsonp(order)
    }
  })
}

/**
 * Show the current Order
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {}

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString()

  res.jsonp(order)
}

/**
 * Update a Order
 */
exports.update = function (req, res) {
  var order = req.order

  order = _.extend(order, req.body)

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.jsonp(order)
    }
  })
}

/**
 * Delete an Order
 */
exports.delete = function (req, res) {
  var order = req.order

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.jsonp(order)
    }
  })
}

/**
 * List of Orders
 */
exports.list = function (req, res) {
  Order.find().sort('-created').populate('user', 'displayName _id firstName lastName')
    .populate('shop')
    .exec(function (err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      } else {
        res.jsonp(orders)
      }
    })
}

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    })
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err)
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      })
    }
    req.order = order
    next()
  })
}

exports.createorderByShopID = function (req, res, next, shopId) {
  Shop.findById(shopId).exec(function (err, shop) {
    if (err) {
      return next(err)
    } else if (!shop) {
      return res.status(404).send({
        message: 'No Shop with that identifier has been found'
      })
    }
    req.shop = shop
    next()
  })
}

exports.genRunningOrder = function (req, res, next) {
  var startDate = new Date()
  startDate.setDate(1)
  startDate.setHours('00', '00', '00')
  var d = new Date()
  d.setDate(0)

  var enddate = new Date(d.getFullYear(), d.getMonth() + 2, 0)
  var today = new Date()
  var formatDate = '00'
  var formatToday = formatDate.substr(0, formatDate.length - today.getDate().toString().length) + today.getDate()
  var getDate = today.getFullYear().toString().substr(2, 4) + (today.getMonth() + 1) + formatToday

  Order.find({created: {$gte: startDate, $lte: enddate},shop: req.shop._id}).sort('-created').exec(function (err, orders) {
    if (err) {
      return next(err)
    } else if (!orders) {
      return res.status(404).send({
        message: 'No orders with that identifier has been found'
      })
    }
    if (orders && orders.length > 0) {
      if (orders[0].receiptNo && orders[0].receiptNo !== undefined) {
        var lengthOfData = parseInt(orders[0].receiptNo.length) - 4
        var running = orders[0].receiptNo.substr(lengthOfData)
        var resultRunning = parseInt(running) + 1
        var pad = '0000'
        var as = pad.substr(0, pad.length - resultRunning.toString().length) + resultRunning
        req.genNumber = req.shop.shopcode + getDate + as
        next()
      }else {
        req.genNumber = req.shop.shopcode + getDate + '0001'
        next()
      }
    }else {
      req.genNumber = req.shop.shopcode + getDate + '0001'
      next()
    }
  })
}

exports.createOrder = function (req, res) {
  var order = new Order(req.body)
  order.user = req.user
  order.shop = req.shop
  order.receiptNo = req.genNumber
  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      Product.populate(order, { path: 'items.product' }, function (err, orderpopproduct) {
        res.json(orderpopproduct)
      })
    }
  })
}

exports.getOrderByShop = function (req, res) {
  Order.find({shop: req.shop._id, $or: [{orderStatus: 'waiting'}, {orderStatus: 'create'}]}).sort('-created').populate('items.product', 'name').exec(function (err, orders) {
    if (err) {
      return res.jsonp(err)
    } else if (!orders) {
      return res.status(404).send({
        message: 'No orders with that identifier has been found'
      })
    }
    res.jsonp(orders)
  })
}
