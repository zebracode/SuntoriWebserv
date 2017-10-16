var Price = require('mongoose').model('Price');

exports.list = function(req, res, next) {
    Price.find({}, function(err, docNo){
        res.json(docNo);
    });
};


exports.create = function(req, res, next) {
    var price = new Price(req.body);
    price.save(function(err){
        if (err) {
            return next(err);
        } else {
            res.json(price);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.price);
};

exports.update = function(req, res, next) {
    Price.findOneAndUpdate({weight: req.price.weight}, req.body,
        function(err, price) {
            if (err) {
                return next(err);
            } else {
                res.json(price);
            }
        }
    );
};

exports.delete = function(req, res, next) {
	
};

exports.priceByWeight = function(req, res, next, weight) {
    Price.findOne({
        weight: weight
    },function(err, price){
        if (err) {
            return next(err);
        } else {
            req.price = price;
            next();
        }
    });
};


