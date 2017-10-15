'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  image: {
    type: [String]
  },
  description: {
    type: String
  },
  price: {
    type: [{
      price: {
        type: Number
      },
      type: {
        type: String
      },
      discount: {
        type: Number
      },
      netprice: {
        type: Number
      }
    }]
  },
  
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  subcate: {
    type: String
  },
  shop_id: {
    type: Schema.ObjectId,
    ref: 'Shop'
  },
  favorite: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Favorite'
    }]
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
