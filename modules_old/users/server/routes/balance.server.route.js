'use strict';

module.exports = function (app) {
  // User Routes
  var balance = require('../controllers/balance.server.controller');

  // Setting up the users profile api
  app.route('/api/balance')
    .get(balance.getBalance)
    .post(balance.create)
    .put(balance.updateBalanceAmt);
  
};


