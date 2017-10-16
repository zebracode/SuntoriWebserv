var CryptoJS = require("crypto-js");
var DocNo = require('mongoose').model('DocNo');

exports.request = function(req, res, next) {
    var version = "6.9";
    var merchantId = "764764000000648";
    var paymentDescription = req.body.paymentDescription;
    var amount = req.body.amount;
    var defaultLang = 'th';
    var resultUrl1 = 'http://188.166.183.79:3000/mains';
    var resultUrl2 = 'http://188.166.183.79:3000/mains';
    var resultUrl1 = 'http://suntoriexpress.com/mains';
    var resultUrl2 = 'http://suntoriexpress.com/mains';
    var secretKey  = 'SyVSRZHCDk28';
    var stringToHash  = "";

    // Set Order ID
    var orderId = "";
    var invoiceNo = "";
    DocNo.findOne({prefix: "ORD"}, function(err, docNo){
        if (err) {
            next(err);
        } else {
            orderId = docNo.prefix + docNo.nextNumber;
            
            // Set Invoice Number
            DocNo.findOne({prefix: "INV"}, function(err, docNo){
                if (err) {
                    return next(err);
                } else {
                    invoiceNo = docNo.prefix + docNo.nextNumber;
                    // stringToHash = version + merchantId + paymentDescription + orderId + invoiceNo + amount + resultUrl1 + resultUrl2 +defaultLang;
					stringToHash = version + merchantId + paymentDescription + orderId + invoiceNo + amount + resultUrl1 + defaultLang;
                    
                    // Encrypt
                    var hashValue = CryptoJS.HmacSHA1(stringToHash, secretKey).toString(CryptoJS.enc.Hex);

                    var result = {
                        version: version,
                        merchantId: merchantId,
                        paymentDescription: paymentDescription,
                        orderId: orderId,
                        invoiceNo: invoiceNo,
                        amount: amount,
                        resultUrl1: resultUrl1,
                        //resultUrl2: resultUrl2,
                        defaultLang: defaultLang,
                        hashValue: hashValue
                    };
                    
                    res.json(result);
                }
            });
        }
    });
    
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

exports.docNoByPrefix = function(req, res, next, prefix) {
    DocNo.findOne({
        prefix: prefix
    },function(err, docNo){
        if (err) {
            return next(err);
        } else {
            req.docNo = docNo;
            next();
        }
    });
};

exports.readDocNo = function(req, res) {
    res.json(req.docNo);
};

exports.updateDocNo = function(req, res, next) {
    DocNo.findOneAndUpdate({prefix: req.docNo.prefix}, req.body,
        function(err, docNo) {
            if (err) {
                return next(err);
            } else {
                res.json(docNo);
            }
        }
    );
};
