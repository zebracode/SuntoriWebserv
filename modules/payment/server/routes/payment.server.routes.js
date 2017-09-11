module.exports = function(app) {
    var payment = require('../controllers/payment.server.controller');
    app.get('/payment', payment.render);
    app.route('/docno')
	    .get(payment.listDocNo)
	    .post(payment.createDocNo);
	app.route('/docno/:prefix')
	    .get(payment.readDocNo)
	    .put(payment.updateDocNo);
	app.param('prefix', payment.docNoByPrefix);
};