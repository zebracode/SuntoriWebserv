'use strict';

var fetch = require('node-fetch');

exports.getOrderStatus = function(req, res) {
    fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/getOrderByBarcode?barcode=' + req.query.barcode)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        res.send(json);
    });
};

exports.createOrder = function(req, res) {
  req.body.productWeight = req.body.productWeight.substring(req.body.productWeight.lastIndexOf('-') + 1, req.body.productWeight.length).replace(/,/g, "");
  fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/addItem',{
	method: 'POST',
	body:    JSON.stringify(req.body),
	headers: {
          'Content-Type': 'application/json' 
        }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      res.send(json);
    });
};

var TpLastNumber = require('mongoose').model('TpLastNumber');

// Create last number which use for calculate mod 11
exports.createLastNumber = function(req, res, next) {
    var tpLastNumber = new TpLastNumber(req.body);
    tpLastNumber.save(function(err) {
       if (err) {
           return next(err);
       } else {
           res.json(tpLastNumber);
       }
    });
};

// Get last number which use for calculate mod 11
exports.getLastNumber = function(req, res, next) {
    TpLastNumber.findOne({}, function(err, tpLastNumbers) {
        if (err) {
            return next(err);
        } else {
            return res.json(tpLastNumbers);
        }
    });
};


// Update last number which use for calculate mod 11
exports.updateLastNumber = function(req, res, next) {    
     TpLastNumber.findOneAndUpdate({}, req.body,
        function(err, tpLastNumbers){
            if(err) {
                return next(err);
            } else {
                return res.json(tpLastNumbers);
            }
        }
    );
};
