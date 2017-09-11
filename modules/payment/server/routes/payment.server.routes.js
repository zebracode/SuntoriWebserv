'use strict';

var payment = require('../controllers/payment.server.controller');

module.exports = function(app) {
	app.route('/payment')
		.post(payment.request);
    app.route('/docno')
	    .get(payment.listDocNo)
	    .post(payment.createDocNo);
	app.route('/docno/:prefix')
	    .get(payment.readDocNo)
	    .put(payment.updateDocNo);
	app.param('prefix', payment.docNoByPrefix);
};