var userPrices = require('../controllers/userprice.server.controller');

module.exports = function(app) {
    app.route('/api/userprices')
        .get(userPrices.list)
        .post(userPrices.create);

    app.route('/api/userprices/:userId')
        .get(userPrices.read)
        .put(userPrices.update)
        .delete(userPrices.delete);

    app.param('userId', userPrices.userPriceByUser);
};