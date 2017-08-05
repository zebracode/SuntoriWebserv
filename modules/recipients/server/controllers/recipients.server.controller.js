'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipient = mongoose.model('Recipient'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a recipient
 */
exports.create = function (req, res) {
  var recipient = new Recipient(req.body);
  recipient.user = req.user;

  recipient.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipient);
    }
  });
};

/**
 * Show the current recipient
 */
exports.read = function (req, res) {
  res.json(req.recipient);
};

/**
 * Update a recipient
 */
exports.update = function (req, res) {
  var recipient = req.recipient;

  recipient.name = req.body.name;
  recipient.tel = req.body.tel;
  recipient.address = req.body.address;
  recipient.country = req.body.country;
  recipient.postcode = req.body.postcode;

  recipient.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipient);
    }
  });
};

/**
 * Delete an recipient
 */
exports.delete = function (req, res) {
  var recipient = req.recipient;

  recipient.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipient);
    }
  });
};

/**
 * List of Recipients
 */
exports.list = function (req, res) {
  Recipient.find().sort('-created').populate('user', 'displayName').exec(function (err, recipients) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipients);
    }
  });
};

/**
 * Recipient middleware
 */
exports.recipientByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipient is invalid'
    });
  }

  Recipient.findById(id).populate('user', 'displayName').exec(function (err, recipient) {
    if (err) {
      return next(err);
    } else if (!recipient) {
      return res.status(404).send({
        message: 'No recipient with that identifier has been found'
      });
    }
    req.recipient = recipient;
    next();
  });
};

exports.findByName = function(req, res, next) {
    Recipient.find({name: {'$regex': '.*' + req.query.searchText + '.*'}}, function(err, recipients){
        if (err) {
            return next(err);
        } else {
            res.json(recipients);
        }
    });
};
