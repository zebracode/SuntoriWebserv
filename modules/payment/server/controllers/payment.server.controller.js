var CryptoJS = require("crypto-js");
var DocNo = require('mongoose').model('DocNo');

exports.render = function(req, res) {
    var version = "6.9";
    var merchantId = "764764000000648";
    var orderId = "ORD00000000000000001";
    var amount = "000000002500";
    
    var stringToHash  = version + merchantId + orderId + amount;
    var secretKey  = 'YyzifJ5hy8qj';
    
    // Encrypt
    var hashValue = CryptoJS.HmacSHA1(stringToHash, secretKey).toString(CryptoJS.enc.Hex);
    
    console.log(hashValue);
    
    var result = {
        version: version,
        merchantId: merchantId,
        orderId: orderId,
        amount: amount,
        hashValue: hashValue
    };
    
    res.json(result);
};

exports.createDocNo = function(req, res, next) {
    var docNo = new DocNo(req.body);
    docNo.save(function(err){
        if (err) {
            return next(err);
        } else {
            res.json(docNo);
        }
    });
};

exports.listDocNo = function(req, res, next) {
    DocNo.find({}, function(err, docNo){
        res.json(docNo);
    });
};

exports.updateDocNo = function(req, res, next) {
    
};