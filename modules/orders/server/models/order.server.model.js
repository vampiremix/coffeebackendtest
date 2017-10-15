'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  // name: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill Order name',
  //   trim: true
  // },
  receiptNo: {
    type: String
  },
  items: {
    type: [{
      product: {
        type: Schema.ObjectId,
        ref: 'Product'
      },
      qty: {
        type: Number
      },
      selectedPrice: {
        price: {type : Number},
        type: {type: String},
        discount: {type: Number},
        netprice: {type: Number}
      }
    }]
  },
  shop: {
    type: Schema.ObjectId,
    ref: 'Shop'
  },
  cashier: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  change: {
    type: Number
  },
  cash: {
    type: Number
  },
  discount: {
    type: Number
  },
  shopName: {
    type: String
  },
  amount: {
    type: Number
  },
  netamount: {
    type: Number
  },
  queue: {
    type: Number
  },
  customer: {
    type: String
  },
  cupcoin: {
    type: Number
  },
  orderStatus: {
    type: [{
      type: String,
      enum: ['create','waiting', 'complete', 'cancel']
    }]
  },
  promotion: {
    type: Schema.ObjectId,
    ref: 'Promotion'
  },
  date: {
    type: Date
  },

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

})

mongoose.model('Order', OrderSchema)
