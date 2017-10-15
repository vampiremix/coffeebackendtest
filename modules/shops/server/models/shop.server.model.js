'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shop name',
    trim: true
  },
  address: {
    type: {
      address: {
        type: String
      },
      subdistrict: {
        type: String
      },
      district: {
        type: String
      },
      province: {
        type: String
      },
      postcode: {
        type: String
      }
    }
  },
  shopcode: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  location: {
    type: {
      lat: {
        type: String
      },
      lng: {
        type: String
      }
    }
  },
  logo:{
    type: String,
    default: "ttp://res.cloudinary.com/hkv4hcrbu/image/upload/v1507261364/Hand-drawn-coffee-logos-design-vector-set-07-280x235_mhtdtd.jpg"
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

mongoose.model('Shop', ShopSchema);
