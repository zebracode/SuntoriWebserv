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
  Statement.find().sort({ created: -1, refNumber: -1 })
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
  
  var criteria = {};

  var startDate = null;
  var endDate = null;

  // User Condition
  if (req.query.ownerId) {
    criteria.owner = req.query.ownerId;
  }

  // Date Condition
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(req.query.endDate);
    endDate.setHours(23, 59, 59, 999);
    criteria.created = { "$gte": startDate, "$lt": endDate };
  } else if (req.query.startDate) {
    startDate = new Date(req.query.startDate);
    criteria.created = { "$gte": startDate };
  } else if (req.query.endDate) {
    endDate = new Date(req.query.endDate);
    criteria.created = { "$lt": endDate };
  }

  Statement.find(criteria).sort({ sortDate: -1, refNumber: -1 })
    .populate('owner', 'displayName')
    .exec(function (err, statements) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var jsonArr = [];

        for (var i = 0; i < statements.length; i++) {
          var json = {};
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

exports.findStatements = function (req, res) {

  var criteria = {};

  var startDate = null;
  var endDate = null;

  // User Condition
  if (req.query.ownerId) {
    criteria.owner = req.query.ownerId;
  }

  // Date Condition
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(req.query.endDate);
    endDate.setHours(23, 59, 59, 999);
    criteria.created = { "$gte": startDate, "$lt": endDate };
  } else if (req.query.startDate) {
    startDate = new Date(req.query.startDate);
    criteria.created = { "$gte": startDate };
  } else if (req.query.endDate) {
    endDate = new Date(req.query.endDate);
    criteria.created = { "$lt": endDate };
  }

  Statement.find(criteria).sort({ sortDate: -1, refNumber: -1 })
    .populate('owner', 'displayName')
    .exec(function (err, statements) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(statements);
      }
    });
};