'use strict';

var fetch = require('node-fetch');

exports.getOrderStatus = function(req, res) {
    fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/getOrderByBarcode?barcode=' + req.query.barcode)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(req.query.barcode);
        res.send(json.statusDescription);
    });
};