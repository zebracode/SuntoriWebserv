'use strict';

/**
 * Module dependencies
 */
var createsPolicy = require('../policies/creates.server.policy'),
  creates = require('../controllers/creates.server.controller');

module.exports = function(app) {
  // Creates Routes
  app.route('/api/creates').all(createsPolicy.isAllowed)
    .get(creates.list)
    .post(creates.create);

  app.route('/api/creates/:createId').all(createsPolicy.isAllowed)
    .get(creates.read)
    .put(creates.update)
    .delete(creates.delete);

  // Finish by binding the Create middleware
  app.param('createId', creates.createByID);
};
