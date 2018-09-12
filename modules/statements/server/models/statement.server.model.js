'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Statement Schema
 */
var StatementSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Statement name',
    trim: true
  },
  amountIn: {
    type: Number,
    default: 0
  },
  amountOut: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  refNumber: {
    type: String,
    default: '',
    trim: true
  },
  sortDate: {
    type: String,
    default: ''
  }
});

mongoose.model('Statement', StatementSchema);
