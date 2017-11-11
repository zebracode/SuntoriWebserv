'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Main = mongoose.model('Main'),
  User = mongoose.model('User'),
  TpLastNumber = require('mongoose').model('TpLastNumber'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a main
 */
exports.create = function (req, res) {
  var main = new Main(req.body);
  main.user = req.user;
  console.log("req.body", req.body);
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
  main.s_ampher = req.body.s_ampher;
  main.s_country = req.body.s_country;
  main.s_postcode = req.body.s_postcode;
  main.s_idNumber = req.body.s_idNumber;
  main.r_name = req.body.r_name;
  main.r_tel = req.body.r_tel;
  main.r_address = req.body.r_address;
  main.r_ampher = req.body.r_ampher;
  main.r_country = req.body.r_country;
  main.r_postcode = req.body.r_postcode;
  main.order = req.body.order;
  main.invoice = req.body.invoice;
  main.price = req.body.price;
  main.weight = req.body.weight;
//  main.selectedOption = req.body.selectedOption;
  main.detail = req.body.detail;
  main.barcode = req.body.barcode;
  main.status = req.body.status;

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
  if (typeof req.query.status === "undefined"){
    Main.find().sort('-created').populate('user').exec(function (err, mains) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(mains);
      }
    });
  } else {
    Main.find({user: req.user, status: req.query.status}).sort('-created').populate('user', 'displayName').exec(function (err, mains) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mains);
    }
  });
  }
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

exports.updateByBarcode = function (req, res, next) {
    Main.findOneAndUpdate({barcode:req.body.barcode}, req.body, 
        function(err, main) {
            if (err) {
                return next(err);
            } else {
                res.json(main);
            }
    });
};

exports.setBarcode = function(req, res, next) {
    Main.findOneAndUpdate({invoice:req.body.invoice}, req.body,
        function(err, main){
            if(err) {
                return next(err);
            } else {
              res.json(main);
            }
        }
    );
};

exports.printAll = function(req, res, next) {
  console.log("ddd",req.query.rcpDocNo);
  Main.find({rcpDocNo:req.query.rcpDocNo}, function(err, mains) {
    if (err)
      return next(err);
    else
      var position = 0;
      for (var i=0; i<mains.length; i++) {
        mains[i].position = position;
        position += 560;
      }
      res.render('modules/mains/server/views/formAll', {
        title: 'Form All',
        mains:mains
      });
  });

};

exports.printBill = function(req, res, next) {
  
  Main.find({rcpDocNo:req.query.rcpDocNo}, function(err, mains) {
    if (err) {
      return next(err);
    } else {

      var totalAmount = 0;
      var dateString = "";
      var timeString = "";

      if (typeof mains[0].receiptDate !== 'undefined') {
        var date = mains[0].receiptDate.getDate() < 10 ? '0' + mains[0].receiptDate.getDate() : mains[0].receiptDate.getDate();
        var month = (mains[0].receiptDate.getMonth() + 1) < 10 ? '0' + (mains[0].receiptDate.getMonth() + 1) : (mains[0].receiptDate.getMonth() + 1);
        var hour = mains[0].receiptDate.getHours() < 10 ? '0' + mains[0].receiptDate.getHours() : mains[0].receiptDate.getHours();
        var minute = mains[0].receiptDate.getMinutes() < 10 ? '0' + mains[0].receiptDate.getMinutes() : mains[0].receiptDate.getMinutes();
        var second = mains[0].receiptDate.getSeconds() < 10 ? '0' + mains[0].receiptDate.getSeconds() : mains[0].receiptDate.getSeconds();
        dateString = date + '/' + month + '/' + mains[0].receiptDate.getFullYear();
        timeString = hour + ':' + minute + ':' + second;
      }
     
      for (var i=0; i<mains.length; i++) {
        var total = parseInt(mains[i].total);
        
        if (!isNaN(total)) {
          totalAmount += total;
        }
      }

      User.findById(mains[0].user, '-salt -password').exec(function (err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          return next(new Error('Failed to load user ' + id));
        }
        
        res.render('modules/mains/server/views/formBill', {
          title: 'Form Bill',
          mains:mains,
          totalAmount: totalAmount,
          dateString: dateString,
          timeString: timeString,
          user: user.username
        });

      });
    }
  });
};


exports.mainByUserAndStatus = function (req, res, next) {  
    Main.find({"user": req.query.user, "status": req.query.status},function (err, main) {
      if (err) {
        return next(err);
      } else {
        res.json(main)
      }
    });
};