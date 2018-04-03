var mongoose = require('mongoose');
WarrantyPrice = mongoose.model('WarrantyPrice');

var getErrorMessage = function(err) {
    if(err.errors) {
        for (var errName in err.errors) {
            if(err.errors[errName].message) {
                err.errors[errName].message;
            }
        }
    } else {
        return 'Unknown server error';
    }
};

exports.create = function(req, res) {
    var warrantyPrice = new WarrantyPrice(req.body);
    warrantyPrice.save(function(err){
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(warrantyPrice);
        }
    });
};

exports.list = function(req, res) {
    WarrantyPrice.find().sort('-productPrice').exec(function(err, warrantyPrice){
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(warrantyPrice)
        }
    });
};

exports.warrantyPriceById = function(req, res, next, id) {
    WarrantyPrice.findById(id).exec(function(err, warrantyPrice){
        if(err) return next(err);
        if(!warrantyPrice) return next(new Error('Failed to load warrantyPrice ' + id));

        req.warrantyPrice = warrantyPrice;
        next();
    });
};

exports.read = function(req, res) {
    res.json(req.warrantyPrice);
};

exports.update = function(req, res) {
    var warrantyPrice = req.warrantyPrice;
    warrantyPrice.productPrice = req.body.productPrice;
    warrantyPrice.warrantyPrice = req.body.warrantyPrice;

    warrantyPrice.save(function(err){
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(warrantyPrice);
        }
    });
};

exports.delete = function(req, res) {
    var warrantyPrice = req.warrantyPrice;
    
    warrantyPrice.remove(function(err){
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(warrantyPrice);
        }
    });
};