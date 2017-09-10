module.exports = function(app) {
    var payment = require('../controllers/payment.server.controller');
    app.get('/payment', payment.render);
};