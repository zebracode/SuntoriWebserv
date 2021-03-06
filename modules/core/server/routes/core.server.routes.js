'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Print AW Post Form
  app.get('/print/formA5', core.printformA5);
  app.get('/print/formA4', core.printformA4);
  app.get('/print/formA6', core.printformA6);
  app.get('/print/sticker', core.printsticker);
  
  // Define application route
  app.route('/*')
  .get(core.renderIndex)
  .post(core.renderIndex);
};
