'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Promotion Schema
 */
var PromotionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Promotion name',
    trim: true
  },
  code:{
    type: String,
    required: 'Please fill Promotion code'
  },

  description:{
    type: String,
    required: 'Please fill Promotion description'
  },

  discountType:{
    type: String,
    required: 'Please fill Promotion discountType'
  },

  discountValue:{
    type: Number,
    required: 'Please fill Promotion discountValue'
  },

  startdate:{
    type: Date,
    required: 'Please fill Promotion startdate'
  },

  enddate:{
    type: Date,
    required: 'Please fill Promotion enddate'
  },

  status:{
    type: String,
    required: 'Please fill Promotion status'
  },
  
  shop: {
    type: Schema.ObjectId,
    ref: 'Shop'
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

mongoose.model('Promotion', PromotionSchema);
