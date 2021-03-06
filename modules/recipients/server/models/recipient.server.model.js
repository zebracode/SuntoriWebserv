'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Recipient Schema
 */
var RecipientSchema = new Schema({
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
  email: {
      type: String,
      default: '',
      trim: true
    },
  address: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  ampher: {
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
  comment: {
      type: String,
      default: '',
      trim: true
    },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Recipient', RecipientSchema);
