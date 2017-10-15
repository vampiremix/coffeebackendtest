'use strict'

/**
 * Module dependencies
 */
var acl = require('acl')

// Using the memory backend
acl = new acl(new acl.memoryBackend())

/**
 * Invoke Orders Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/orders',
      permissions: '*'
    }, {
      resources: '/api/orders/:orderId',
      permissions: '*'
    }, {
      resources: '/api/orders/create/:shopId',
      permissions: '*'
    }, {
      resources: '/api/orders/orderslist/:shopId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/orders',
      permissions: ['get', 'post']
    }, {
      resources: '/api/orders/:orderId',
      permissions: ['get']
    }, {
      resources: '/api/orders/create/:shopId',
      permissions: '*'
    }, {
      resources: '/api/orders/orderslist/:shopId',
      permissions: '*'
    }]
  }, {
    roles: ['shopowner'],
    allows: [{
      resources: '/api/orders',
      permissions: ['get', 'post']
    }, {
      resources: '/api/orders/:orderId',
      permissions: ['get']
    }, {
      resources: '/api/orders/create/:shopId',
      permissions: '*'
    }, {
      resources: '/api/orders/orderslist/:shopId',
      permissions: '*'
    }]
  }, {
    roles: ['operator'],
    allows: [{
      resources: '/api/orders',
      permissions: ['get', 'post']
    }, {
      resources: '/api/orders/:orderId',
      permissions: ['get']
    }, {
      resources: '/api/orders/create/:shopId',
      permissions: '*'
    }, {
      resources: '/api/orders/orderslist/:shopId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/orders',
      permissions: ['get']
    }, {
      resources: '/api/orders/:orderId',
      permissions: ['get']
    },{
      resources: '/api/orders/orderslist/:shopId',
      permissions: '*'
    }]
  }])
}

/**
 * Check If Orders Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  // console.log(JSON.stringify(req));
  if(req.user) { console.log("TRUE THIS HAVE REQ.USER !!!!!");}
  else{console.log("TRUE THIS NOT HAVE NOOOOOOOO REQ.USER !!!!!");}
  var roles = (req.user) ? req.user.roles : ['guest']

  // If an Order is being processed and the current user created it then allow any manipulation
  if (req.order && req.user && req.order.user && req.order.user.id === req.user.id) {
    return next()
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error')
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next()
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        })
      }
    }
  })
}
