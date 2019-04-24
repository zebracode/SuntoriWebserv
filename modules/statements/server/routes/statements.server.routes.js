'use strict';

/**
 * Module dependencies
 */
var statementsPolicy = require('../policies/statements.server.policy'),
  statements = require('../controllers/statements.server.controller');

module.exports = function(app) {
  // Statements Routes
  app.route('/api/statements').all(statementsPolicy.isAllowed)
    .get(statements.list)
    .post(statements.create);

  app.route('/api/statements/:statementId').all(statementsPolicy.isAllowed)
    .get(statements.read)
    .put(statements.update)
    .delete(statements.delete);

  // Finish by binding the Statement middleware
  app.param('statementId', statements.statementByID);

  // Export Excel
  app.route('/api/excel/statements')
  .get(statements.excel);

  app.get('/api/findStatements', statements.findStatements);

  app.post('/api/update/statementById', statements.updateById);
  
};
