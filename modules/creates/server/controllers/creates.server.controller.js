'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Create = mongoose.model('Create'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Create
 */
exports.create = function(req, res) {
  var create = new Create(req.body);
  create.user = req.user;

  create.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(create);
    }
  });
};

/**
 * Show the current Create
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var create = req.create ? req.create.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  create.isCurrentUserOwner = req.user && create.user && create.user._id.toString() === req.user._id.toString();

  res.jsonp(create);
};

/**
 * Update a Create
 */
exports.update = function(req, res) {
  var create = req.create;

  create = _.extend(create, req.body);

  create.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(create);
    }
  });
};

/**
 * Delete an Create
 */
exports.delete = function(req, res) {
  var create = req.create;

  create.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(create);
    }
  });
};

/**
 * List of Creates
 */
exports.list = function(req, res) {
  Create.find().sort('-created').populate('user', 'displayName').exec(function(err, creates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(creates);
    }
  });
};

/**
 * Create middleware
 */
exports.createByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Create is invalid'
    });
  }

  Create.findById(id).populate('user', 'displayName').exec(function (err, create) {
    if (err) {
      return next(err);
    } else if (!create) {
      return res.status(404).send({
        message: 'No Create with that identifier has been found'
      });
    }
    req.create = create;
    next();
  });
};
