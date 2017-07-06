'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Main = mongoose.model('Main'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a main
 */
exports.create = function (req, res) {
  var main = new Main(req.body);
  main.user = req.user;

  main.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(main);
    }
  });
};

/**
 * Show the current main
 */
exports.read = function (req, res) {
  res.json(req.main);
};

/**
 * Update a main
 */
exports.update = function (req, res) {
  var main = req.main;

  main.s_name = req.body.s_name;
  main.s_tel = req.body.s_tel;
  main.s_address = req.body.s_address;
  main.s_country = req.body.s_country;
  main.s_postcode = req.body.s_postcode;
  main.r_name = req.body.r_name;
  main.r_tel = req.body.r_tel;
  main.r_address = req.body.r_address;
  main.r_country = req.body.r_country;
  main.r_postcode = req.body.r_postcode;
  main.order = req.body.order;
  main.invoice = req.body.invoice;
  main.price = req.body.price;
  main.weight = req.body.weight;
  main.detail = req.body.detail;
  main.barcode = req.body.barcode;

  main.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(main);
    }
  });
};

/**
 * Delete an main
 */
exports.delete = function (req, res) {
  var main = req.main;

  main.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(main);
    }
  });
};

/**
 * List of Mains
 */
exports.list = function (req, res) {
  Main.find().sort('-created').populate('user', 'displayName').exec(function (err, mains) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mains);
    }
  });
};

/**
 * Main middleware
 */
exports.mainByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Main is invalid'
    });
  }

  Main.findById(id).populate('user', 'displayName').exec(function (err, main) {
    if (err) {
      return next(err);
    } else if (!main) {
      return res.status(404).send({
        message: 'No main with that identifier has been found'
      });
    }
    req.main = main;
    next();
  });
};