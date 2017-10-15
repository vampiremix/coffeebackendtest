'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cart = mongoose.model('Cart'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cart
 */
exports.create = function(req, res) {
  var cart = new Cart(req.body);
  cart.user = req.user;

  cart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * Show the current Cart
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cart = req.cart ? req.cart.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cart.isCurrentUserOwner = req.user && cart.user && cart.user._id.toString() === req.user._id.toString();

  res.jsonp(cart);
};

/**
 * Update a Cart
 */
exports.update = function(req, res) {
  var cart = req.cart;

  cart = _.extend(cart, req.body);

  cart.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * Delete an Cart
 */
exports.delete = function(req, res) {
  var cart = req.cart;

  cart.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cart);
    }
  });
};

/**
 * List of Carts
 */
exports.list = function(req, res) {
  Cart.find().sort('-created').populate('user', 'displayName').exec(function(err, carts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carts);
    }
  });
};

/**
 * Cart middleware
 */
exports.cartByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cart is invalid'
    });
  }

  Cart.findById(id).populate('user', 'displayName').exec(function (err, cart) {
    if (err) {
      return next(err);
    } else if (!cart) {
      return res.status(404).send({
        message: 'No Cart with that identifier has been found'
      });
    }
    req.cart = cart;
    next();
  });
};
