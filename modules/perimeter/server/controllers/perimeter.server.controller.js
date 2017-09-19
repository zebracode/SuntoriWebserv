var Perimeter = require('mongoose').model('Perimeter');

exports.list = function(req, res, next) {
	Perimeter.find({}, function(err, perimeter){
		if (err){
			return next(err);
		} else {
			res.json(perimeter);
		}
	});
};

exports.read = function(req, res, next) {
	Perimeter.findOne({provinceName: req.query.provinceName}, 
		function(err, perimeter) {
			if (err) {
				return next(err);
			} else {
				res.json(perimeter);
			}
	});
};

exports.create = function(req, res, next) {
	var perimeter = new Perimeter(req.body);
	perimeter.save(function(err){
		if (err) {
			return next(err);
		} else {
			res.json(perimeter);
		}
	});
};

exports.update = function(req, res, next) {
	Perimeter.findOneAndUpdate({provinceName: req.query.provinceName}, req.body,
		function(err, perimeter){
			if (err) {
				return next(err);
			} else {
				res.json(perimeter);
			}
	});
};

exports.delete = function(req, res, next) {
	Perimeter.remove({provinceName: req.query.provinceName}, 
		function(err, result) {
			if (err) {
				return next(err);
			} else {
				res.json(result);
			}
	});
};