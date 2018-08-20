'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	mongoose = require('mongoose'),
	Main = mongoose.model('Main'),
	User = mongoose.model('User'),
	multer = require('multer'),
	xlstojson = require("xls-to-json-lc"),
	xlsxtojson = require("xlsx-to-json-lc"),
	fecha = require('fecha'),
	TpLastNumber = require('mongoose').model('TpLastNumber'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a main
 */
exports.create = function (req, res) {
	var main = new Main(req.body);
	main.user = req.user;
	main.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(main);
		}
	});
};

/**
 * Show the current main
 */
exports.read = function (req, res) {
	res.json(req.main);
};

/**
 * Update a main
 */
exports.update = function (req, res) {
	var main = req.main;

	main.s_name = req.body.s_name;
	main.s_tel = req.body.s_tel;
	main.s_address = req.body.s_address;
	main.s_ampher = req.body.s_ampher;
	main.s_country = req.body.s_country;
	main.s_postcode = req.body.s_postcode;
	main.s_idNumber = req.body.s_idNumber;
	main.r_name = req.body.r_name;
	main.r_tel = req.body.r_tel;
	main.r_address = req.body.r_address;
	main.r_ampher = req.body.r_ampher;
	main.r_country = req.body.r_country;
	main.r_postcode = req.body.r_postcode;
	main.order = req.body.order;
	main.invoice = req.body.invoice;
	main.price = req.body.price;
	main.productPrice = req.body.productPrice;
	main.weight = req.body.weight;
	//  main.selectedOption = req.body.selectedOption;
	main.detail = req.body.detail;
	main.detail_Product = req.body.detail_Product;
	main.insurance = req.body.insurance;
	main.barcode = req.body.barcode;
	main.status = req.body.status;

	main.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(main);
		}
	});
};

/**
 * Delete an main
 */
exports.delete = function (req, res) {
	var main = req.main;

	main.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(main);
		}
	});
};

/**
 * List of Mains
 */
exports.list = function (req, res) {
	if (typeof req.query.user !== "undefined") {
		Main.find(
			{
				user: req.query.user
			}).sort('-created').populate('user').exec(function (err, mains) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(mains);
				}
			});
	} else {
		var queryObject = {};

		if (req.query.startDate !== req.query.endDate) {
			queryObject = {
				created: { $gte: req.query.startDate, $lte: req.query.endDate }
			}
		} else {
			queryObject = {
				created: { $gte: req.query.startDate }
			}
		}

		if (req.query.userId) {
			queryObject.user = req.query.userId;
		}

		Main.find(queryObject).sort('-created').populate('user', 'displayName').exec(function (err, mains) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//console.log("user: ", mains[0].user._id);
				res.json(mains);
			}
		});
	}
};

/**
 * Main middleware
 */
exports.mainByID = function (req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Main is invalid'
		});
	}

	Main.findById(id).populate('user', 'displayName').exec(function (err, main) {
		if (err) {
			return next(err);
		} else if (!main) {
			return res.status(404).send({
				message: 'No main with that identifier has been found'
			});
		}
		req.main = main;
		next();
	});
};

exports.updateByBarcode = function (req, res, next) {
	Main.findOneAndUpdate({ barcode: req.body.barcode }, req.body,
		function (err, main) {
			if (err) {
				return next(err);
			} else {
				res.json(main);
			}
		});
};

exports.setBarcode = function (req, res, next) {
	Main.findOneAndUpdate({ invoice: req.body.invoice }, req.body,
		function (err, main) {
			if (err) {
				return next(err);
			} else {
				res.json(main);
			}
		}
	);
};

exports.printAll = function (req, res, next) {
	Main.find({ rcpDocNo: req.query.rcpDocNo }, function (err, mains) {
		if (err)
			return next(err);
		else
			var position = 0;
		for (var i = 0; i < mains.length; i++) {
			mains[i].position = position;
			position += 560;
		}
		res.render('modules/mains/server/views/formAll', {
			title: 'Form All',
			mains: mains
		});
	});
};

exports.printBill = function (req, res, next) {

  	Main.find({ rcpDocNo: req.query.rcpDocNo }, function (err, mains) {
  		if (err) {
  			return next(err);
  		} else {
  			if (mains.length > 0) {
  				var totalAmount = 0;
  				var dateString = "";
  				var timeString = "";
  				var totalVatAmnt = 0;

  				if (typeof mains[0].receiptDate !== 'undefined') {
  					var date = mains[0].receiptDate.getDate() < 10 ? '0' + mains[0].receiptDate.getDate() : mains[0].receiptDate.getDate();
  					var month = (mains[0].receiptDate.getMonth() + 1) < 10 ? '0' + (mains[0].receiptDate.getMonth() + 1) : (mains[0].receiptDate.getMonth() + 1);
  					var hour = mains[0].receiptDate.getHours() < 10 ? '0' + mains[0].receiptDate.getHours() : mains[0].receiptDate.getHours();
  					var minute = mains[0].receiptDate.getMinutes() < 10 ? '0' + mains[0].receiptDate.getMinutes() : mains[0].receiptDate.getMinutes();
  					var second = mains[0].receiptDate.getSeconds() < 10 ? '0' + mains[0].receiptDate.getSeconds() : mains[0].receiptDate.getSeconds();
  					dateString = date + '/' + month + '/' + mains[0].receiptDate.getFullYear();
  					timeString = hour + ':' + minute + ':' + second;
  				}

  				for (var i = 0; i < mains.length; i++) {
  					var total = Number(mains[i].grandTotalAmnt);

  					if (!isNaN(total)) {
  						totalAmount += total;
  					}

  					var vatAmt = Number(mains[i].totalVatAmnt);
  					if(!isNaN(vatAmt)){
  						totalVatAmnt += vatAmt;
  					}

  				}

  				User.findById(mains[0].user, '-salt -password').exec(function (err, user) {
  					if (err) {
  						return next(err);
  					} else if (!user) {
  						return next(new Error('Failed to load user ' + id));
  					}

  					res.render('modules/mains/server/views/formBill', {
  						title: 'Form Bill',
  						mains: mains,
  						totalVatAmnt: totalVatAmnt,
  						totalAmount: totalAmount,
  						dateString: dateString,
  						timeString: timeString,
  						user: user.username
  					});

  				});
  			} else {
  				res.send("No data to print !!!");
  			}
  		}
  	});
  };

exports.printSlip = function (req, res, next) {

	Main.find({ rcpDocNo: req.query.rcpDocNo }, function (err, mains) {
		if (err) {
			return next(err);
		} else {
			if (mains.length > 0) {
				var totalAmount = 0;
				var dateString = "";
				var timeString = "";
				var totalVatAmnt = 0;

				if (typeof mains[0].receiptDate !== 'undefined') {
					var date = mains[0].receiptDate.getDate() < 10 ? '0' + mains[0].receiptDate.getDate() : mains[0].receiptDate.getDate();
					var month = (mains[0].receiptDate.getMonth() + 1) < 10 ? '0' + (mains[0].receiptDate.getMonth() + 1) : (mains[0].receiptDate.getMonth() + 1);
					var hour = mains[0].receiptDate.getHours() < 10 ? '0' + mains[0].receiptDate.getHours() : mains[0].receiptDate.getHours();
					var minute = mains[0].receiptDate.getMinutes() < 10 ? '0' + mains[0].receiptDate.getMinutes() : mains[0].receiptDate.getMinutes();
					var second = mains[0].receiptDate.getSeconds() < 10 ? '0' + mains[0].receiptDate.getSeconds() : mains[0].receiptDate.getSeconds();
					dateString = date + '/' + month + '/' + mains[0].receiptDate.getFullYear();
					timeString = hour + ':' + minute + ':' + second;
				}

				for (var i = 0; i < mains.length; i++) {
					var total = Number(mains[i].grandTotalAmnt);

					if (!isNaN(total)) {
						totalAmount += total;
					}

					var vatAmt = Number(mains[i].totalVatAmnt);
					if(!isNaN(vatAmt)){
						totalVatAmnt += vatAmt;
					}

				}

				User.findById(mains[0].user, '-salt -password').exec(function (err, user) {
					if (err) {
						return next(err);
					} else if (!user) {
						return next(new Error('Failed to load user ' + id));
					}

					res.render('modules/mains/server/views/formSlip', {
						title: 'Form Slip',
						mains: mains,
						totalVatAmnt: totalVatAmnt,
						totalAmount: totalAmount,
						dateString: dateString,
						timeString: timeString,
						user: user.username
					});

				});
			} else {
				res.send("No data to print !!!");
			}
		}
	});
};

exports.mainByUserAndStatus = function (req, res, next) {
	Main.find({ "user": req.query.user, "status": req.query.status }, function (err, main) {
		if (err) {
			return next(err);
		} else {
			res.json(main);
		}
	});
};

exports.totalMains = function (req, res, next) {
	Main.count({}, function (err, count) {
		if (err) {
			return next(err);
		} else {
			res.json(count);
		}
	});
};

// Upload shipping by excel
exports.uploadShipping = function (req, res) {
	var storage = multer.diskStorage({ //multers disk storage settings
		destination: function (req, file, cb) {
			cb(null, './uploads/')
		},
		filename: function (req, file, cb) {
			var datetimestamp = Date.now();
			cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
		}
	});

	var upload = multer({ //multer settings
		storage: storage,
		fileFilter: function (req, file, callback) { //file filter
			if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
				return callback(new Error('Wrong extension type'));
			}
			callback(null, true);
		}
	}).single('file');

	var exceltojson;

	upload(req, res, function (err) {
		if (err) {
			res.json({ error_code: 1, err_desc: err });
			return;
		}
		/** Multer gives us file info in req.file object */
		if (!req.file) {
			res.json({ error_code: 1, err_desc: "No file passed" });
			return;
		}
		/** Check the extension of the incoming file and 
		 *  use the appropriate module
		 */
		if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
			exceltojson = xlsxtojson;
		} else {
			exceltojson = xlstojson;
		}
		try {
			exceltojson({
				input: req.file.path,
				output: null, //since we don't need output.json
				lowerCaseHeaders: true
			}, function (err, result) {
				if (err) {
					return res.json({ error_code: 1, err_desc: err, data: null });
				}
				res.json({ error_code: 0, err_desc: null, data: result });
			});
		} catch (e) {
			res.json({ error_code: 1, err_desc: "Corupted excel file" });
		}
	})
};

exports.findByName = function(req, res, next) {
    Main.find({name: { "$regex": req.query.searchText, "$options": "i" }, user: req.query.userId}, function(err, mains){
        if (err) {
            return next(err);
        } else {
            res.json(mains);
        }
    });
};

// Boonchuay 2 August 2018 Start
exports.findByBarcode = function(req, res, next) {
	// When already login
	if(req.query.userId) {
		Main.find({barcode: { "$regex": req.query.searchText, "$options": "i" }, user: req.query.userId}, function(err, mains){
			if (err) {
				return next(err);
			} else {
				res.json(mains);
			}
		});
	// When not login
	} else {
		Main.find({barcode: { "$regex": req.query.searchText, "$options": "i" }}, function(err, mains){
			if (err) {
				return next(err);
			} else {
				res.json(mains);
			}
		});
	}
    
};
// Boonchuay 2 August 2018 End


// Boonchuay 6 August 2018 S
// Export Summary as Excel
exports.exportSummary = function (req, res, next) {
	var criteria = {};

	if(req.query.userId){
		criteria.user = req.query.userId;
	}

	if(req.query.startDate){
		criteria.created =  {$gte: req.query.startDate};
	}

	if(req.query.endDate){
		criteria.created = {$lte: req.query.endDate};
	}

	Main.find(criteria).sort('-created')
	.exec(function (err, mains) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var jsonArr = [];

			for (var i = 0; i < mains.length; i++) {
				var json = {};
				json.created_date = fecha.format(mains[i].created, 'mediumDate');
				json.tracking_number = mains[i].barcode;
				json.sender_name = mains[i].s_name;
				json.reciver_name = mains[i].r_name;
				json.receiver_tel = mains[i].r_tel;
				json.weight = mains[i].weight;
				json.actual_weigth = mains[i].tpWeight;
				json.amount = mains[i].total;
				json.actual_amount = mains[i].afterPrice;
				json.diff_amount = mains[i].total - mains[i].afterPrice;
				json.insurance = mains[i].insuranceAmnt;
				json.comment = mains[i].detail_Product;
				json.status = mains[i].status;
				jsonArr.push(json);
			}
			res.xls('summary.xlsx', jsonArr);
		}
	});
};


// Boonchuay 19 August 2018 Start
exports.findMains = function(req, res, next){
	var startDate = new Date(req.query.startDate);//.toISOString();
	var endDate = new Date(req.query.endDate);//.toISOString();

	console.log("start date: " + startDate);
	console.log("end date: " + endDate);
	//console.log("end ISO date: " + startIsoDate);

	var criteria = {};

	if(req.query.userId){
		criteria.userId = req.query.userId;
	}

	if(req.query.startDate){
		criteria.startDate =  startDate;
	}

	if(req.query.endDate){
		criteria.endDate = endDate;
	}

	if(req.query.status){
		criteria.status = req.query.status;
	}

	Main.find({
		user:criteria.userId, 
		created: {"$gte": criteria.startDate, "$lt": criteria.endDate}
	}).sort('-created') 
	.exec(function(err, mains){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			for(var i=0; i<mains.length; i++){
				console.log("created: " + mains[i].created);
			}
			//console.log("created: " + mains.created:);
			res.json(mains);
		}
	});
};
// Boonchuay 19 August 2018 End
