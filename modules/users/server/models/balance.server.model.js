'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema
  
/**
 * Balance Schema
 */
var BalanceSchema = new Schema({
    userId: {
      type: String
    },
    balanceAmt: {
      type: String
    }
});

mongoose.model('Balance', BalanceSchema);


