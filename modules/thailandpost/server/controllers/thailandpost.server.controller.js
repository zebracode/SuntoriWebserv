'use strict';

const fetch = require('node-fetch');
const mongoose = require('mongoose');
const TpLastNumber = mongoose.model('TpLastNumber');

// ตรวจสอบสถานะการจัดส่งโดย barcode
exports.getOrderStatus = function (req, res) {
    const barcode = req.query.barcode;
    const url = `http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/getOrderByBarcode?barcode=${barcode}`;

    fetch(url)
        .then(async function (response) {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return res.send(json);
            } catch (err) {
                console.error(`❌ JSON parse error for barcode ${barcode}:`, err.message);
                return res.status(502).send({
                    error: true,
                    message: 'Invalid JSON response from Thailand Post API',
                    raw: text
                });
            }
        })
        .catch(function (error) {
            console.error(`❌ Fetch failed for barcode ${barcode}:`, error.message);
            res.status(500).send({
                error: true,
                message: 'Fetch error',
                details: error.message
            });
        });
};

// สร้างรายการใหม่
exports.createOrder = function (req, res) {
    try {
        req.body.productWeight = req.body.productWeight
            .substring(req.body.productWeight.lastIndexOf('-') + 1)
            .replace(/,/g, "");
    } catch (err) {
        return res.status(400).send({
            error: true,
            message: 'Invalid productWeight format'
        });
    }

    fetch('http://suntoriexpress:suntoriexpressws@r_dservice.thailandpost.com:8080/webservice/addItem', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async function (response) {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return res.send(json);
            } catch (err) {
                console.error('❌ JSON parse error in createOrder:', err.message);
                return res.status(502).send({
                    error: true,
                    message: 'Invalid JSON response from Thailand Post API',
                    raw: text
                });
            }
        })
        .catch(function (error) {
            console.error('❌ Fetch failed in createOrder:', error.message);
            res.status(500).send({
                error: true,
                message: 'Fetch error',
                details: error.message
            });
        });
};

// สร้างเลขล่าสุด (ใช้สำหรับ mod 11)
exports.createLastNumber = function (req, res, next) {
    const tpLastNumber = new TpLastNumber(req.body);
    tpLastNumber.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(tpLastNumber);
        }
    });
};

// ดึงเลขล่าสุด
exports.getLastNumber = function (req, res, next) {
    TpLastNumber.findOne({}, function (err, tpLastNumbers) {
        if (err) {
            return next(err);
        } else {
            res.json(tpLastNumbers);
        }
    });
};

// อัปเดตเลขล่าสุด
exports.updateLastNumber = function (req, res, next) {
    TpLastNumber.findOneAndUpdate({}, req.body, { new: true }, function (err, tpLastNumbers) {
        if (err) {
            return next(err);
        } else {
            res.json(tpLastNumbers);
        }
    });
};
