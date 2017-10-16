'use strict';

module.exports = function(app) {
    var thailandpost = require('../controllers/thailandpost.server.controller');
    app.route('/getOrderStatus').get(thailandpost.getOrderStatus);
    app.post('/api/thailandpost/createOrder', thailandpost.createOrder);
    
    app.route('/lastNumber')
        .post(thailandpost.createLastNumber)
        .get(thailandpost.getLastNumber)
        .put(thailandpost.updateLastNumber);
};

