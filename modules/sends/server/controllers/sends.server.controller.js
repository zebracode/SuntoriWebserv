'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Send = mongoose.model('Send'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a send
 */
exports.create = function (req, res) {
  var send = new Send(req.body);
  send.user = req.user;

  send.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(send);
    }
  });
};

/**
 * Show the current send
 */
exports.read = function (req, res) {
  res.json(req.send);
};

/**
 * Update a send
 */
exports.update = function (req, res) {
  var send = req.send;

  send.title = req.body.title;
  send.content = req.body.content;

  send.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(send);
    }
  });
};

/**
 * Delete an send
 */
exports.delete = function (req, res) {
  var send = req.send;

  send.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(send);
    }
  });
};

/**
 * List of Sends
 */
exports.list = function (req, res) {
  Send.find().sort('-created').populate('user', 'displayName').exec(function (err, sends) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(sends);
    }
  });
};

/**
 * Send middleware
 */
exports.sendByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Send is invalid'
    });
  }

  Send.findById(id).populate('user', 'displayName').exec(function (err, send) {
    if (err) {
      return next(err);
    } else if (!send) {
      return res.status(404).send({
        message: 'No send with that identifier has been found'
      });
    }
    req.send = send;
    next();
  });
};
