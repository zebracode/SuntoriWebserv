var path = require('path'),
  mongoose = require('mongoose'),
  Balance = mongoose.model('Balance');

exports.updateBalanceAmt = function(req, res, next) {
    Balance.findOneAndUpdate({userId: req.body.userId}, req.body,
        function(err, balance){
            if(err) {
                return next(err);
            } else {
                return res.json(balance);
            }
        }
    );
};

exports.create = function (req, res, next) {
  var balance = new Balance(req.body);

  balance.save(function (err) {
    if (err) {
      return next(err);
    } else {
      res.json(balance);
    }
  });
};

exports.getBalance = function (req, res, next) {
   console.log(req.query.userId);
   Balance.findOne({userId: req.query.userId}, function(err, balance) {
        if (err) {
            return next(err);
        } else {
            return res.json(balance);
        }
   });
};
