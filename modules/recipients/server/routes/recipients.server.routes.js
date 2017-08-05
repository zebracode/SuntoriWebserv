'use strict';

/**
 * Module dependencies.
 */
var recipientsPolicy = require('../policies/recipients.server.policy'),
  recipients = require('../controllers/recipients.server.controller');

module.exports = function (app) {
  // Recipients collection routes
  app.route('/api/recipients').all(recipientsPolicy.isAllowed)
    .get(recipients.list)
    .post(recipients.create);

  // Single recipient routes
  app.route('/api/recipients/:recipientId').all(recipientsPolicy.isAllowed)
    .get(recipients.read)
    .put(recipients.update)
    .delete(recipients.delete);

  // Finish by binding the recipient middleware
  app.param('recipientId', recipients.recipientByID);
  
  app.route('/api/recipient/findByName')
    .get(recipients.findByName);
};
