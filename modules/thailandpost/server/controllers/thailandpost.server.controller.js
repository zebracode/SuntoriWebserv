'use strict';

var fetch = require('node-fetch');

exports.getOrderStatus = function(req, res) {
    fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/getOrderByBarcode?barcode=' + req.query.barcode)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        res.send(json.statusDescription);
    });
};

exports.createOrder = function(req, res) {
    fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/getOrderByBarcode?barcode=' + req.query.barcode)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        res.send(json.statusDescription);
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
