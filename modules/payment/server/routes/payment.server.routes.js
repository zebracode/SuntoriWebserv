module.exports = function(app) {
    var payment = require('../controllers/payment.server.controller');
    app.get('/payment', payment.render);
    app.route('/docno')
    .get(payment.listDocNo)
    .post(payment.createDocNo);
};