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
  name: {
    type: String,
    default: '',
    required: 'Please fill Statement name',
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

mongoose.model('Statement', StatementSchema);
