'use strict';

/**
 * Module dependencies.
 */
var sendsPolicy = require('../policies/sends.server.policy'),
  sends = require('../controllers/sends.server.controller');

module.exports = function (app) {
  // Sends collection routes
  app.route('/api/sends').all(sendsPolicy.isAllowed)
    .get(sends.list)
    .post(sends.create);

  // Single send routes
  app.route('/api/sends/:sendId').all(sendsPolicy.isAllowed)
    .get(sends.read)
    .put(sends.update)
    .delete(sends.delete);

  // Finish by binding the send middleware
  app.param('sendId', sends.sendByID);
};
