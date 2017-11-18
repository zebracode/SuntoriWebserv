'use strict';

var mongoose = require('mongoose');
var Main = mongoose.model('Main');
var Balance = mongoose.model('Balance');
var DocNo = require('mongoose').model('DocNo');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res, next) {
  if (typeof req.body.amount !== 'undefined' && req.body.payment_status === '000') {
    var amount = parseInt(req.body.amount.substring(0, req.body.amount.length - 2));

    //Update Order ID
    DocNo.findOne({prefix: "ORD"}, function(err, docNo){
      if (err) {
        return next(err);
      } else {
        var nextNumber = formatNextNumber(parseInt(docNo.nextNumber) + 1, 17);
        DocNo.findOneAndUpdate({prefix: "ORD"}, {nextNumber: nextNumber},
          function(err, docNo) {
              if (err) {
                  return next(err);
              }
          }
        );
      }
    });

    // Update Invoice Number
    DocNo.findOne({prefix: "INV"}, function(err, docNo){
      if (err) {
        return next(err);
      } else {
        var nextNumber = formatNextNumber(parseInt(docNo.nextNumber) + 1, 17);
        DocNo.findOneAndUpdate({prefix: "INV"}, {nextNumber: nextNumber},
          function(err, docNo) {
              if (err) {
                  return next(err);
              }
          }
        );
      }
    });
    

    function formatNextNumber(number, length) {
      var str = '' + number;
      while (str.length < length) {
        str = '0' + str;
      }

      return str;
    }

    Balance.findOne({userId: req.user._id}, function(err, balance){
      if(err) {
        return next(err);
      } else {
        if (balance === null) {
          var bl = new Balance({userId: req.user._id, balanceAmt: amount});
          bl.save(function(err){
              if (err) {
                return next(err);
              } else {
                res.redirect('/mains');
              }
          });
        } else {
          var oldBalance = balance.balanceAmt;
          var newBalance = amount + parseInt(oldBalance) + '';
          Balance.findOneAndUpdate({userId: req.user._id}, {balanceAmt: newBalance},
            function(err, balance){
                if(err) {
                    return next(err);
                } else {
                    res.redirect('/mains');
                }
            }
          );
        }
      }
    });
  } else {
    res.render('modules/core/server/views/index', {
      user: req.user || null
    });
  } 
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
      return next(err);
    else
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
      res.render('modules/core/server/views/formA4', {
        title: 'formA4',
        main:main
      });
  });

};

exports.printformA6 = function(req, res, next) {

  Main.findById(req.query.mainId, function(err, main) {
    if (err)
      next(err);
    else
      res.render('modules/core/server/views/formA6', {
        title: 'formA6',
        main:main
      });
  });

};
