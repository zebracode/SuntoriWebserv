'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Statement = mongoose.model('Statement'),
  fecha = require('fecha'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


exports.create = function (req, res) {
  var statement = new Statement(req.body);
  statement.user = req.user;

  statement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statement);
    }
  });
};

/**
 * Show the current Statement
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var statement = req.statement ? req.statement.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  statement.isCurrentUserOwner = req.user && statement.user && statement.user._id.toString() === req.user._id.toString();

  res.jsonp(statement);
};

/**
 * Update a Statement
 */
exports.update = function (req, res) {
  var statement = req.statement;

  statement = _.extend(statement, req.body);

  statement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statement);
    }
  });
};

/**
 * Delete an Statement
 */
exports.delete = function (req, res) {
  var statement = req.statement;

  statement.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statement);
    }
  });
};

/**
 * List of Statements
 */
exports.list = function (req, res) {
  Statement.find().sort({created: 1, refNumber: -1})
  .populate('user', 'displayName').populate('owner', 'displayName').exec(function (err, statements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statements);
    }
  });
};

/**
 * Statement middleware
 */
exports.statementByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Statement is invalid'
    });
  }

  Statement.findById(id).populate('user', 'displayName').exec(function (err, statement) {
    if (err) {
      return next(err);
    } else if (!statement) {
      return res.status(404).send({
        message: 'No Statement with that identifier has been found'
      });
    }
    req.statement = statement;
    next();
  });
};

// Excel Export
exports.excel = function (req, res, next) {
  Statement.find().sort('-created').populate('user', 'displayName').populate('owner', 'displayName').exec(function (err, statements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var jsonArr = [];
      var json = {};
      for (var i = 0; i < statements.length; i++) {
        json.created = fecha.format(statements[i].created, 'mediumDate');
        json.owner = statements[i].owner.displayName;
        json.name = statements[i].name;
        json.amountIn = statements[i].amountIn;
        json.amountOut = statements[i].amountOut;
        json.balanceAmount = statements[i].balanceAmount;
        jsonArr.push(json);
      }
      res.xls('statements.xlsx', jsonArr);
    }
  });
};
