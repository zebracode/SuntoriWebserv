'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Create Schema
 */
var CreateSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Create name',
    trim: true
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

mongoose.model('Create', CreateSchema);
