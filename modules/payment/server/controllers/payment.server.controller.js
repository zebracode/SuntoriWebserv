var CryptoJS = require("crypto-js");

exports.render = function(req, res) {
    var version = "6.9";
    var merchantId = "764764000000648";
    var orderId = "ORD2017090700001";
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
