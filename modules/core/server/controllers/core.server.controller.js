'use strict';

var mongoose = require('mongoose');
var Main = mongoose.model('Main');


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.printformA5 = function(req, res, next) {

  Main.findById(req.query.mainId, function(err, main) {
    if (err)
      next(err);
    else
      console.log('main', main);  

      res.render('modules/core/server/views/formA5', {
        title: 'FormA5',
        main:main
      });
  });

};

exports.printformA4 = function(req, res, next) {

  Main.findById(req.query.mainId, function(err, main) {
    if (err)
      next(err);
    else
      console.log('main', main);

      res.render('modules/core/server/views/formA4', {
        title: 'formA4',
        main:main
      });
  });

};
