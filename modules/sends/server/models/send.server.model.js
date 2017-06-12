'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Send Schema
 */
var SendSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  tel: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  add: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  country: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
  postcode: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Send', SendSchema);
